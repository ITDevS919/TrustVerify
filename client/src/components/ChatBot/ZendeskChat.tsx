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

    // Check if Zendesk is already loaded
    if (window.zE) {
      setZendeskLoaded(true);
      return;
    }

    // Load Zendesk Web Widget script
    const script = document.createElement('script');
    script.id = 'ze-snippet';
    script.src = `https://static.zdassets.com/ekr/snippet.js?key=${zendeskKey}`;
    script.async = true;
    
    script.onload = () => {
      setZendeskLoaded(true);
      
      // Configure Zendesk widget
      if (window.zE) {
        window.zE('webWidget', 'hide');
        
        // Set widget theme colors to match TrustVerify branding
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
      }
    };

    script.onerror = () => {
      console.error('Failed to load Zendesk widget');
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup: Remove script if component unmounts
      const existingScript = document.getElementById('ze-snippet');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const handleChatToggle = () => {
    if (zendeskLoaded && window.zE) {
      // Use Zendesk widget if available
      window.zE('webWidget', 'toggle');
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
    if (zendeskLoaded && window.zE) {
      window.zE('webWidget', 'hide');
    } else {
      setIsMinimized(true);
      setIsChatOpen(false);
    }
  };

  const handleClose = () => {
    if (zendeskLoaded && window.zE) {
      window.zE('webWidget', 'hide');
    } else {
      setIsChatOpen(false);
      setIsMinimized(false);
    }
  };

  // Hide Zendesk default launcher if using custom button
  useEffect(() => {
    if (zendeskLoaded && window.zE) {
      window.zE('webWidget', 'hide');
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
