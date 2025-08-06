import { Button } from "./ui/button";

export default function CardExamples() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 flex flex-col items-center justify-center">
      {/* Single Card Example */}
      <div className="max-w-md mx-auto mb-12">
        <h2 className="text-3xl font-sans text-foreground mb-6 tracking-wide">Single Card</h2>
        <div className="bg-card text-card-foreground border border-border rounded-md p-6 shadow-lg">
          <h3 className="text-xl font-sans text-foreground mb-2 tracking-wide">Card Title</h3>
          <p className="text-muted-foreground font-serif mb-4 tracking-wide">
            This is a simple card using your global CSS variables. It uses bg-card, text-card-foreground, and border-border.
          </p>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            Action Button
          </Button>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="max-w-6xl mx-auto mb-12">
        <h2 className="text-3xl font-sans text-foreground mb-6 tracking-wide">Card Grid</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-card text-card-foreground border border-border rounded-md p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-sans text-foreground mb-2 tracking-wide">Feature One</h3>
            <p className="text-muted-foreground font-serif mb-4 tracking-wide">
              Description of the first feature using your custom fonts and colors.
            </p>
            <Button variant="outline" className="border-border text-foreground hover:bg-muted">
              Learn More
            </Button>
          </div>

          {/* Card 2 */}
          <div className="bg-card text-card-foreground border border-border rounded-md p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-secondary/10 rounded-md flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-sans text-foreground mb-2 tracking-wide">Feature Two</h3>
            <p className="text-muted-foreground font-serif mb-4 tracking-wide">
              Another feature description with consistent styling and spacing.
            </p>
            <Button variant="outline" className="border-border text-foreground hover:bg-muted">
              Learn More
            </Button>
          </div>

          {/* Card 3 */}
          <div className="bg-card text-card-foreground border border-border rounded-md p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-md flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-xl font-sans text-foreground mb-2 tracking-wide">Feature Three</h3>
            <p className="text-muted-foreground font-serif mb-4 tracking-wide">
              Third feature with the same design system and custom properties.
            </p>
            <Button variant="outline" className="border-border text-foreground hover:bg-muted">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Horizontal Card Layout */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl font-sans text-foreground mb-6 tracking-wide">Horizontal Cards</h2>
        <div className="space-y-4">
          <div className="bg-card text-card-foreground border border-border rounded-md p-6 shadow-lg flex items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-sans text-foreground mb-2 tracking-wide">Horizontal Card Title</h3>
              <p className="text-muted-foreground font-serif tracking-wide">
                This card uses flexbox layout with your global CSS colors and spacing.
              </p>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Action
            </Button>
          </div>

          <div className="bg-card text-card-foreground border border-border rounded-md p-6 shadow-lg flex items-center gap-6">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-sans text-foreground mb-2 tracking-wide">Another Horizontal Card</h3>
              <p className="text-muted-foreground font-serif tracking-wide">
                Consistent styling with your custom fonts, colors, and spacing variables.
              </p>
            </div>
            <Button variant="outline" className="border-border text-foreground hover:bg-muted">
              Secondary
            </Button>
          </div>
        </div>
      </div>

      {/* Masonry-style Grid */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-sans text-foreground mb-6 tracking-wide">Masonry Grid</h2>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          <div className="bg-card text-card-foreground border border-border rounded-md p-6 shadow-lg break-inside-avoid">
            <h3 className="text-lg font-sans text-foreground mb-2 tracking-wide">Short Card</h3>
            <p className="text-muted-foreground font-serif tracking-wide">Brief description.</p>
          </div>
          
          <div className="bg-card text-card-foreground border border-border rounded-md p-6 shadow-lg break-inside-avoid">
            <h3 className="text-lg font-sans text-foreground mb-2 tracking-wide">Medium Card</h3>
            <p className="text-muted-foreground font-serif tracking-wide mb-4">
              This card has a bit more content to show how the masonry layout works with different heights.
            </p>
            <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted">
              Read More
            </Button>
          </div>
          
          <div className="bg-card text-card-foreground border border-border rounded-md p-6 shadow-lg break-inside-avoid">
            <h3 className="text-lg font-sans text-foreground mb-2 tracking-wide">Longer Card</h3>
            <p className="text-muted-foreground font-serif tracking-wide mb-4">
              This is a longer card with more content to demonstrate how the masonry grid adapts to different content lengths.
              It shows how your global CSS maintains consistency across different card sizes.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted">
                Action 1
              </Button>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Action 2
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 