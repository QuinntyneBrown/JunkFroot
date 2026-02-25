import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="font-display text-4xl text-jf-coconut tracking-wider text-center mb-8">OUR STORY</h1>

      <div class="space-y-12">
        <section class="text-center">
          <p class="font-accent text-2xl text-jf-gold mb-4">Real Juice. Real Culture. Real Tech.</p>
          <p class="font-body text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Junkfroot was born from a simple idea: bring the bold, vibrant flavours of the Caribbean
            to the streets of the Greater Toronto Area. We're not just a juice truck — we're a
            cultural experience on wheels.
          </p>
        </section>

        <section class="bg-jf-dark rounded-xl p-8 border border-jf-gold/10">
          <h2 class="font-display text-2xl text-jf-coconut tracking-wide mb-4">CARIBBEAN ROOTS</h2>
          <p class="font-body text-gray-300 leading-relaxed">
            Every recipe draws from the rich culinary traditions of Trinidad, Jamaica, Barbados,
            and the wider Caribbean diaspora. From sorrel-infused blends to mango-passionfruit
            combinations, each drink tells a story of island heritage.
          </p>
        </section>

        <section class="bg-jf-dark rounded-xl p-8 border border-jf-gold/10">
          <h2 class="font-display text-2xl text-jf-coconut tracking-wide mb-4">OUR MISSION</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <span class="font-accent text-3xl text-jf-mango">Fresh</span>
              <p class="font-body text-sm text-gray-400 mt-2">
                Whole fruits and vegetables, cold-pressed daily. No concentrates, no compromise.
              </p>
            </div>
            <div class="text-center">
              <span class="font-accent text-3xl text-jf-lime">Culture</span>
              <p class="font-body text-sm text-gray-400 mt-2">
                Every sip connects you to the Caribbean. We celebrate our heritage through flavour.
              </p>
            </div>
            <div class="text-center">
              <span class="font-accent text-3xl text-jf-sorrel">Community</span>
              <p class="font-body text-sm text-gray-400 mt-2">
                Built for the neighbourhoods we serve. Local partnerships, community events, real connections.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class AboutComponent {}
