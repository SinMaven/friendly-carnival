import Link from "next/link"

export default function ThemePreviewPage() {
    return (
        <div className="container py-10 space-y-10">
            <div>
                <h1 className="text-3xl font-bold mb-4">Theme Preview</h1>
                <p className="text-muted-foreground">
                    Visualizing the design tokens for the new hacking platform interface.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ColorCard name="Background" className="bg-background text-foreground border" />
                <ColorCard name="Foreground" className="bg-foreground text-background border" />
                <ColorCard name="Card" className="bg-card text-card-foreground border" />
                <ColorCard name="Popover" className="bg-popover text-popover-foreground border" />
                <ColorCard name="Primary" className="bg-primary text-primary-foreground" />
                <ColorCard name="Secondary" className="bg-secondary text-secondary-foreground" />
                <ColorCard name="Muted" className="bg-muted text-muted-foreground" />
                <ColorCard name="Accent" className="bg-accent text-accent-foreground" />
                <ColorCard name="Destructive" className="bg-destructive text-destructive-foreground" />
                <ColorCard name="Border" className="bg-border text-foreground" />
                <ColorCard name="Input" className="bg-input text-foreground" />
                <ColorCard name="Ring" className="bg-ring text-background" />
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Typography & Components</h2>
                <div className="p-6 border rounded-lg bg-card text-card-foreground space-y-4">
                    <h3 className="text-xl font-semibold">Card Title</h3>
                    <p className="text-muted-foreground">
                        This is a card description using muted foreground color. It should differ slightly from the main text.
                    </p>
                    <div className="flex gap-4">
                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition">
                            Primary Button
                        </button>
                        <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:opacity-90 transition">
                            Secondary Button
                        </button>
                        <button className="px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded transition">
                            Outline Button
                        </button>
                        <button className="px-4 py-2 text-primary hover:underline underline-offset-4 transition">
                            Link Button
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ColorCard({ name, className }: { name: string; className: string }) {
    return (
        <div className={`p-4 rounded-lg flex items-center justify-center h-24 text-sm font-medium ${className}`}>
            {name}
        </div>
    )
}
