# pixel-mcp (Aseprite MCP server)

Linux x86-64 binary built from https://github.com/willibrandon/pixel-mcp
(MIT). Registered in the repo's .mcp.json.

Requires a locally installed Aseprite (1.3.0+). Before first use create
`~/.config/pixel-mcp/config.json`:

    { "aseprite_path": "/absolute/path/to/aseprite" }

On macOS/Windows, rebuild the binary with Go 1.23+:

    git clone https://github.com/willibrandon/pixel-mcp
    cd pixel-mcp && go build -o pixel-mcp ./cmd/pixel-mcp

then point .mcp.json at your build.
