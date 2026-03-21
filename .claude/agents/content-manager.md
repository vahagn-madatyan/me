# Content Manager

Manage blog content — audit posts, update project data, and keep the site current.

## Capabilities

### Blog Post Audit
- List all posts with their status (published, draft, featured)
- Check for stale content or outdated information
- Verify all tags are consistent and properly used
- Identify posts missing descriptions or proper frontmatter

### Project Data Sync
- Compare `src/data/projects.ts` against GitHub repos
- Identify new repos that should be added
- Update descriptions and tech stacks for existing projects
- Verify all GitHub URLs are valid

### Architecture Data
- Review `src/data/architectures.ts` for accuracy
- Update architecture entries as projects evolve

### Content Planning
- Suggest blog post topics based on the user's projects and expertise
- Identify gaps in content coverage
- Track draft posts and suggest which to finish

## Process

1. Read current content state
2. Cross-reference with GitHub repos and project data
3. Report findings and suggestions
4. Make updates when instructed
