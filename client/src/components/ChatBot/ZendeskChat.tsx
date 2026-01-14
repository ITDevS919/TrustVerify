import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { LiveChat } from './LiveChat';

// Zendesk Web Widget configuration
declare global {
  interface Window {
    zE?: any;
    zESettings?: any;
  }
}

export default function ZendeskChat() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [zendeskLoaded, setZendeskLoaded] = useState(false);

  // Load Zendesk Web Widget SDK
  useEffect(() => {
    const zendeskKey = (import.meta as any).env?.VITE_ZENDESK_KEY || '';
 
    if (!zendeskKey) {
      console.warn('Zendesk key not configured. Using custom chat widget.');
      return;
    }

    // Check if this might be a Zopim key (old format, typically longer and different pattern)
    // Zopim keys are incompatible with Web Widget SDK
    // Web Widget keys are typically 32 characters, but can vary
    // Zopim keys are usually much longer (40+ characters)
    if (zendeskKey.length > 40) {
      console.warn(
        '⚠️ Zendesk Key Warning: The provided key appears to be a Zopim key (legacy chat product). ' +
        'Zopim keys are not compatible with the Zendesk Web Widget SDK. ' +
        'Please obtain a Web Widget key from your Zendesk Admin Center: ' +
        'Settings > Channels > Web Widget. ' +
        'Falling back to custom chat widget.'
      );
      return;
    }

    // Check if Zendesk is already loaded
    if (window.zE) {
      setZendeskLoaded(true);
      // Configure if already loaded
      configureZendeskWidget();
      return;
    }

    // Pre-configure Zendesk settings (optional, but recommended)
    // This ensures settings are applied as soon as the widget loads
    window.zESettings = {
      webWidget: {
        color: {
          theme: '#003366', // TrustVerify primary blue
          launcher: '#003366',
          launcherText: '#FFFFFF',
          button: '#003366',
          resultLists: '#FFFFFF',
          header: '#003366',
          articleLinks: '#003366',
        },
        position: {
          horizontal: 'right',
          vertical: 'bottom',
        },
        launcher: {
          chatLabel: {
            'en-US': 'Need help? Chat with us',
          },
        },
      },
    };

    // Load Zendesk Web Widget script
    const script = document.createElement('script');
    script.id = 'ze-snippet';
    script.src = `https://static.zdassets.com/ekr/snippet.js?key=${zendeskKey}`;
    script.async = true;
    
    script.onload = () => {
      // Wait for zE API to be available
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max wait
      
      const checkZendesk = setInterval(() => {
        attempts++;
        
        if (window.zE && typeof window.zE === 'function') {
          clearInterval(checkZendesk);
          setZendeskLoaded(true);
          
          // Wait a bit more for the widget to be fully initialized
          setTimeout(() => {
            configureZendeskWidget();
          }, 500);
        } else if (attempts >= maxAttempts) {
          clearInterval(checkZendesk);
          console.warn('Zendesk widget did not initialize within 5 seconds. Using custom chat widget.');
        }
      }, 100);
    };

    script.onerror = (error) => {
      console.error('Failed to load Zendesk widget script:', error);
      console.error(
        'This might indicate:\n' +
        '1. The Zendesk key is invalid or incorrect\n' +
        '2. You are using a Zopim key instead of a Web Widget key\n' +
        '3. Network connectivity issues\n\n' +
        'To get your Web Widget key:\n' +
        '1. Log in to Zendesk Admin Center\n' +
        '2. Go to Settings > Channels > Web Widget\n' +
        '3. Copy the Widget Key (not the Zopim key)\n' +
        '4. Set it as VITE_ZENDESK_KEY in your .env file'
      );
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup: Remove script if component unmounts
      const existingScript = document.getElementById('ze-snippet');
      if (existingScript) {
        existingScript.remove();
      }
      // Clean up zE reference
      if (window.zE) {
        try {
          window.zE('webWidget', 'hide');
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
    };
  }, []);

  // Configure Zendesk widget settings
  const configureZendeskWidget = () => {
    if (!window.zE || typeof window.zE !== 'function') {
      return;
    }

    try {
      // Hide the default launcher (we're using a custom button)
      window.zE('webWidget', 'hide');
      
      // Update widget settings to match TrustVerify branding
      window.zE('webWidget', 'updateSettings', {
        color: {
          theme: '#003366', // TrustVerify primary blue
          launcher: '#003366',
          launcherText: '#FFFFFF',
          button: '#003366',
          resultLists: '#FFFFFF',
          header: '#003366',
          articleLinks: '#003366',
        },
        position: {
          horizontal: 'right',
          vertical: 'bottom',
        },
        launcher: {
          chatLabel: {
            'en-US': 'Need help? Chat with us',
          },
        },
      });

      // Listen for widget events to track state
      window.zE('webWidget:on', 'open', () => {
        setIsChatOpen(true);
      });

      window.zE('webWidget:on', 'close', () => {
        setIsChatOpen(false);
      });

      console.log('Zendesk Web Widget configured successfully');
    } catch (error: any) {
      console.error('Failed to configure Zendesk widget:', error);
      // If configuration fails, it might be a Zopim key issue
      if (error.message && (error.message.includes('Zopim') || error.message.includes('invalid'))) {
        console.error(
          '❌ Zendesk Error: The key provided may be invalid or a Zopim key. ' +
          'Please get your Web Widget key from: Zendesk Admin > Settings > Channels > Web Widget'
        );
      }
    }
  };

  const handleChatToggle = () => {
    if (zendeskLoaded && window.zE && typeof window.zE === 'function') {
      try {
        // Use Zendesk widget if available
        window.zE('webWidget', 'toggle');
      } catch (error) {
        console.error('Failed to toggle Zendesk widget:', error);
        // Fallback to custom chat widget
        if (isMinimized) {
          setIsMinimized(false);
          setIsChatOpen(true);
        } else {
          setIsChatOpen(!isChatOpen);
        }
      }
    } else {
      // Fallback to custom chat widget
      if (isMinimized) {
        setIsMinimized(false);
        setIsChatOpen(true);
      } else {
        setIsChatOpen(!isChatOpen);
      }
    }
  };

  const handleMinimize = () => {
    if (zendeskLoaded && window.zE && typeof window.zE === 'function') {
      try {
        window.zE('webWidget', 'hide');
      } catch (error) {
        console.error('Failed to hide Zendesk widget:', error);
        setIsMinimized(true);
        setIsChatOpen(false);
      }
    } else {
      setIsMinimized(true);
      setIsChatOpen(false);
    }
  };

  const handleClose = () => {
    if (zendeskLoaded && window.zE && typeof window.zE === 'function') {
      try {
        window.zE('webWidget', 'hide');
      } catch (error) {
        console.error('Failed to hide Zendesk widget:', error);
        setIsChatOpen(false);
        setIsMinimized(false);
      }
    } else {
      setIsChatOpen(false);
      setIsMinimized(false);
    }
  };

  // Hide Zendesk default launcher if using custom button
  useEffect(() => {
    if (zendeskLoaded && window.zE && typeof window.zE === 'function') {
      try {
        window.zE('webWidget', 'hide');
      } catch (error) {
        // Ignore errors - widget might not be fully ready
      }
    }
  }, [zendeskLoaded]);

  return (
    <>
      {/* Custom styling for the chat widget */}
      <style>
        {`
          /* Chat button styles - matching TrustVerify branding */
          .live-chat-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: #003366;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 51, 102, 0.3);
            transition: all 0.3s ease;
            z-index: 9998;
            border: none;
          }
          
          .live-chat-button:hover {
            background: #004080;
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(0, 51, 102, 0.4);
          }

          .live-chat-button.minimized {
            background: #FFB400;
            animation: pulse 2s infinite;
          }

          .live-chat-button.minimized:hover {
            background: #E6A200;
          }

          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(255, 180, 0, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(255, 180, 0, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(255, 180, 0, 0);
            }
          }
          
          @media (max-width: 768px) {
            .live-chat-button {
              bottom: 15px;
              right: 15px;
              width: 50px;
              height: 50px;
            }
          }

          /* Hide Zendesk default launcher when using custom button */
          #launcher {
            display: none !important;
          }
        `}
      </style>

      {/* Live Chat Button */}
      <button 
        className={`live-chat-button ${isMinimized ? 'minimized' : ''}`}
        onClick={handleChatToggle}
        title={isChatOpen ? "Close Chat" : isMinimized ? "Unread Messages - Click to Open" : "Start Live Chat"}
        aria-label="Open customer support chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Custom Live Chat Widget (fallback when Zendesk is not configured) */}
      {!zendeskLoaded && (
        <LiveChat 
          isOpen={isChatOpen}
          onClose={handleClose}
          onMinimize={handleMinimize}
        />
      )}
    </>
  );
}
