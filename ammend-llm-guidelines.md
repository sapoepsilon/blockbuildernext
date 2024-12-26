# LLM Guidelines for Code Editing in Next.js 15 and React 18

## Core Editing Principles

1. **Maintain Server-First Architecture**
   - Preserve Server Component integrity when editing
   - Only convert to Client Component when absolutely necessary
   - Keep "move down" principle intact for client-side logic
   - Add 'use client' directive only at component level that needs it

2. **Type Safety Preservation**
   - Maintain or enhance existing TypeScript types
   - Never remove type definitions without replacement
   - Update related interfaces when modifying props
   - Ensure Zod schemas stay in sync with type changes

3. **Performance Considerations**
   - Preserve existing Suspense boundaries
   - Maintain or improve component segmentation
   - Keep image optimizations intact
   - Don't remove streaming implementations

4. **State Management Integrity**
   - Preserve Server Actions structure
   - Maintain immutability in state updates
   - Keep optimistic updates implementation
   - Preserve existing React hooks logic

## Code Editing Guidelines

1. **Component Modifications**
   ```typescript
   // Before editing:
   - Review the component's server/client status
   - Identify all props and their usage
   - Note existing performance optimizations
   - Check for component composition patterns
   ```

2. **Type System Updates**
   ```typescript
   // When modifying interfaces:
   - Update all dependent components
   - Maintain backwards compatibility where possible
   - Update Zod schemas accordingly
   - Preserve generic type parameters
   ```

3. **State Updates**
   ```typescript
   // When editing state:
   - Keep atomic state updates
   - Maintain existing state initialization
   - Preserve error boundary logic
   - Keep loading state implementations
   ```

## Edit Safety Checklist

1. **Pre-Edit Verification**
   - [ ] Component role and responsibility understood
   - [ ] Server/Client component status confirmed
   - [ ] Dependencies and imports identified
   - [ ] Type system implications reviewed

2. **During Edit**
   - [ ] Maintain file structure conventions
   - [ ] Preserve existing error handling
   - [ ] Keep performance optimizations
   - [ ] Maintain type safety

3. **Post-Edit Validation**
   - [ ] Types remain strict and accurate
   - [ ] Server/Client boundary integrity maintained
   - [ ] Performance optimizations preserved
   - [ ] Error handling remains robust

## Common Edit Patterns

1. **Adding New Features**
   ```typescript
   // Follow these steps:
   1. Add new types/interfaces first
   2. Implement new logic
   3. Update existing types if needed
   4. Add error handling
   ```

2. **Modifying Existing Features**
   ```typescript
   // Follow these steps:
   1. Preserve existing types
   2. Update logic incrementally
   3. Maintain error handling
   4. Update tests accordingly
   ```

3. **Removing Features**
   ```typescript
   // Follow these steps:
   1. Check for dependencies
   2. Remove unused types
   3. Clean up imports
   4. Update related components
   ```

## Edit-Specific Best Practices

1. **Component Updates**
   - Maintain shadcn/ui component structure
   - Preserve component composition patterns
   - Keep prop drilling minimal
   - Maintain accessibility features

2. **State Management Updates**
   - Keep Server Actions pure
   - Maintain state initialization patterns
   - Preserve React hooks rules
   - Keep context usage consistent

3. **Performance Considerations**
   - Maintain existing memoization
   - Keep code splitting boundaries
   - Preserve lazy loading patterns
   - Keep bundle size optimizations

## Security Guidelines for Edits

1. **Data Handling**
   - Maintain input sanitization
   - Keep validation logic intact
   - Preserve authentication checks
   - Keep authorization logic

2. **API Integration**
   - Maintain error handling
   - Keep rate limiting logic
   - Preserve security headers
   - Keep authentication tokens secure

## Documentation Requirements

1. **Code Comments**
   - Update JSDoc when modifying functions
   - Maintain inline documentation
   - Keep type definitions documented
   - Update README when needed

2. **Change Documentation**
   - Document breaking changes
   - Update API documentation
   - Keep changelog updated
   - Maintain version compatibility notes
