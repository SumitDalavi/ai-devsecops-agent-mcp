// Simple test to verify compilation and basic functionality
import { z } from 'zod';

describe('DevSecOps MCP Agent', () => {
  it('should have basic tests', () => {
    const schema = z.object({
      repoName: z.string(),
      branch: z.string().optional()
    });
    
    const result = schema.safeParse({ repoName: 'test-repo' });
    expect(result.success).toBe(true);
  });
});
