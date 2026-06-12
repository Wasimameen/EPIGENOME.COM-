# mcp-veo2 (Google Veo 2 video generation MCP server)

Built from https://github.com/mario-andreschak/mcp-veo2 (MIT).
Registered as "veo2" in the repo's .mcp.json.

Setup before first use:
1. cd tools/mcp-veo2 && npm install   (runtime deps are not committed)
2. Get a Google AI Studio API key with Veo access at aistudio.google.com
   (Veo requires billing enabled on the key).
3. Put the key in .mcp.json under mcpServers.veo2.env.GOOGLE_API_KEY,
   or set it as an environment variable.

Tools: generateVideoFromText, generateVideoFromImage,
listGeneratedVideos. See PROMPT.md for the ready-made prompt for this
site's flight film.
