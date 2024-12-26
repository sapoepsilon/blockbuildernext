# LLM Guidelines for Debugging Next.js 15 and React 18

## Bug Investigation Process

1. **Initial Assessment**
   - Reproduce the bug consistently
   - Identify the affected components
   - Check server/client component boundaries
   - Review related error logs
   - Verify environment context (dev/prod)

2. **Root Cause Analysis**
   - Trace data flow through components
   - Check state management integrity
   - Verify type consistency
   - Review network requests
   - Examine build outputs

3. **Common Bug Categories**
   ```typescript
   // 1. Hydration Errors
   - Server/Client HTML mismatch
   - useEffect timing issues
   - Dynamic content rendering
   
   // 2. Type Errors
   - Incorrect interface implementations
   - Missing null checks
   - Invalid type assertions
   
   // 3. State Management
   - Race conditions
   - Stale closures
   - Incorrect dependency arrays
   
   // 4. Performance Issues
   - Unnecessary re-renders
   - Memory leaks
   - Bundle size problems
   ```

## Debugging Techniques

1. **Server Components**
   ```typescript
   // Debug Steps:
   1. Check data fetching
   2. Verify streaming setup
   3. Review cache invalidation
   4. Check error boundaries
   ```

2. **Client Components**
   ```typescript
   // Debug Steps:
   1. Console logging strategy
   2. React DevTools inspection
   3. Network tab analysis
   4. State/Props verification
   ```

3. **API Integration**
   ```typescript
   // Debug Steps:
   1. Request/Response logging
   2. Error handling review
   3. Status code verification
   4. Payload validation
   ```

## Debug Safety Checklist

1. **Pre-Debug Analysis**
   - [ ] Bug reproduction steps documented
   - [ ] Environment variables checked
   - [ ] Related components identified
   - [ ] Error logs collected

2. **During Debug**
   - [ ] Keep logging structured
   - [ ] Document attempted solutions
   - [ ] Test in all environments
   - [ ] Maintain type safety

3. **Post-Debug Verification**
   - [ ] Bug fully resolved
   - [ ] No new issues introduced
   - [ ] Performance maintained
   - [ ] Tests updated/added

## Debugging Tools

1. **React DevTools**
   - Component tree inspection
   - Props/State monitoring
   - Performance profiling
   - Component filters

2. **Browser DevTools**
   - Network requests
   - Console outputs
   - Memory usage
   - Performance metrics

3. **Next.js Specific**
   - Build analysis
   - Server logs
   - Route debugging
   - API route testing

## Common Debug Patterns

1. **Component Debugging**
   ```typescript
   // Implementation:
   1. Add console.logs strategically
   2. Use React.Profiler
   3. Check render cycles
   4. Verify prop drilling
   ```

2. **State Debugging**
   ```typescript
   // Implementation:
   1. Log state changes
   2. Track effect triggers
   3. Verify update batching
   4. Check state initialization
   ```

3. **Performance Debugging**
   ```typescript
   // Implementation:
   1. Use React DevTools Profiler
   2. Check unnecessary renders
   3. Verify memoization
   4. Monitor bundle sizes
   ```

## Testing After Fixes

1. **Unit Tests**
   - Add test for bug scenario
   - Update affected tests
   - Check edge cases
   - Verify type coverage

2. **Integration Tests**
   - Test component interaction
   - Verify data flow
   - Check error scenarios
   - Test boundary conditions

3. **E2E Tests**
   - Add user flow test
   - Verify fix in production
   - Test across browsers
   - Check mobile compatibility

## Documentation Requirements

1. **Bug Documentation**
   - Clear reproduction steps
   - Environment details
   - Related components
   - Solution explanation

2. **Code Comments**
   - Document fix rationale
   - Note potential impacts
   - Mark sensitive areas
   - Update related docs

3. **Regression Prevention**
   - Add warning comments
   - Document edge cases
   - Note dependencies
   - Update guidelines

## Prevention Guidelines

1. **Code Quality**
   - Maintain strict TypeScript
   - Use proper error boundaries
   - Implement proper validation
   - Follow React best practices

2. **Monitoring**
   - Add relevant logging
   - Set up error tracking
   - Monitor performance
   - Track user impact

3. **Review Process**
   - Document changes
   - Add test coverage
   - Update documentation
   - Perform thorough testing
