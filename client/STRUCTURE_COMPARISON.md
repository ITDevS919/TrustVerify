# Project Structure Comparison

## TrustVerify (Original) vs Trust-Verify-Upgrade (New)

### Key Differences

#### 1. **Routing**
- **Original**: Uses `wouter` (lightweight router)
- **New**: Uses `react-router-dom` (standard React Router)
- **Action**: Keep `react-router-dom` but need to add protected route wrapper

#### 2. **API Client**
- **Original**: Has `lib/queryClient.ts` with TanStack Query setup
- **New**: Missing - needs to be created
- **Action**: Create API client utilities

#### 3. **Authentication**
- **Original**: Has `hooks/use-auth.tsx` with AuthProvider
- **New**: Missing - needs to be created
- **Action**: Create authentication hooks and context

#### 4. **Protected Routes**
- **Original**: Has `lib/protected-route.tsx`
- **New**: Missing - needs to be created
- **Action**: Create protected route component for react-router-dom

#### 5. **UI Components**
- **Original**: Has toast, tooltip, and other UI components
- **New**: Has basic UI components but missing toast, tooltip
- **Action**: Add missing UI components

#### 6. **App Structure**
- **Original**: App.tsx includes QueryClientProvider, AuthProvider, TooltipProvider
- **New**: App.tsx only has basic routing
- **Action**: Update App.tsx to include all providers

#### 7. **Vite Configuration**
- **Original**: Has path aliases and potentially proxy setup
- **New**: Basic Vite config
- **Action**: Add API proxy and path aliases

#### 8. **Screen/Page Structure**
- **Original**: Pages in `src/pages/`
- **New**: Screens in `src/screens/` (new UI/UX design)
- **Action**: Keep new structure, add API integration

### Implementation Plan

1. ✅ Backend structure - COMPLETED
2. ✅ Database schema - COMPLETED
3. ✅ Security modules - COMPLETED
4. ⏳ Add TanStack Query dependency
5. ⏳ Create API client utilities
6. ⏳ Create authentication hooks
7. ⏳ Create protected route component
8. ⏳ Update App.tsx with providers
9. ⏳ Add missing UI components (toast, tooltip)
10. ⏳ Update Vite config for API proxy
11. ⏳ Integrate API calls into screens (preserving UI/UX)

