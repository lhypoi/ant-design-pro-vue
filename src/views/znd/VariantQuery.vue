<template>
  <div class="flex-auto flex flex-col bg-white rounded-3xl p-8">
    <div v-if="loading" class="w-[750px] mx-auto pt-10">
      <a-skeleton active :paragraph="{ rows: 10 }" />
    </div>
    <div v-show="!loading">
      <div ref="container"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VariantQuery',
  components: {
  },
  data() {
    return {
      loading: true,
      htmlStr: `
    <div class="stackedit__html">
      <h1>Variant Query</h1>
<p>The authorized users are able to query SNP and INDEL data via gene symbol, rs ID, genomic regions, or genomic positions. The searching result table includes the information of chromosome name(CHR), position(POS), rs ID in dbSNP v150(ID), reference genotype(RFE), alteration genotype(ALT), variant quality(QUAL), allele frequency in the 1KCIGP sample sets(Alt_freq), gene symbol(gene), and allele frequency in 87 European pig individuals(<a></a>European_AF).</p>
<p><img src="/znd/p1.png" alt=""></p>
<h2>Usage</h2>
<p>There are four different search types provided in 1KCIGP, including gene symbol, rs ID, genomic regions, and genomic positions. Users can click the left drop-down mean to select.</p>
<ol>
<li>Gene symbol</li>
</ol>
<p>The gene symbol name should fill in the middle blank box, like “FMO3” or “AHR”, and the gene symbol name are not in case sensitive.</p>
<ol>
<li>rsID</li>
</ol>
<p>The rsID should fill in the middle blank box, like “rs712813288”.</p>
<ol>
<li>Regions</li>
</ol>
<p>This will search the SNPs and INDELs in the submit regions.</p>
<ol>
<li>Positions</li>
</ol>
<p>This will search the SNP or INDEL in the reference position.</p>
<h2>Results</h2>
<p>The query result is shown in the figure below:</p>
<p><img src="/znd/p2.png" alt=""></p>
<ul>
<li>
<p>CHROM, Chromosome</p>
</li>
<li>
<p>POS, The reference position</p>
</li>
<li>
<p>ID, The rs ID in dbSNP</p>
</li>
<li>
<p>REF, Reference base</p>
</li>
<li>
<p>ALT, Alternate base</p>
</li>
<li>
<p>QUAL, Phred-scaled quality score for the assertion made in ALT</p>
</li>
<li>
<p>Alt_freq, Allele Frequency</p>
</li>
<li>
<p>gene, Gene symbol</p>
</li>
<li>
<p>European_AF, Allele Frequency in 87 European pig individuals</p>
</li>
</ul>
<p>The reference genome is Sus scrofa 11.1. The gene set used in 1KCIGP is Ensembl Release 107.</p>

    </div>
      `
    }
  },
  computed: {
  },
  created() {
    this.loading = true
  },
  async mounted() {
    const shadowRoot = this.$refs.container.attachShadow({ mode: 'open' })
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://stackedit.io/style.css'
    shadowRoot.appendChild(link)
    const div = document.createElement('div')
    div.style.cssText = `
      color: rgba(0,0,0,.75);
      font-size: 16px;
      font-family: Lato,Helvetica Neue,Helvetica,sans-serif;
      font-variant-ligatures: common-ligatures;
      line-height: 1.67;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale
    `
    div.innerHTML = this.htmlStr
    shadowRoot.appendChild(div)
    const links = shadowRoot.querySelectorAll('a')
    links.forEach(link => {
      link.addEventListener('click', (event) => {
        const targetId = event.target.getAttribute('href')
        const targetElement = shadowRoot.querySelector(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' })
        }
      })
    })

    setTimeout(() => {
      this.loading = false
      const hash = window.location.hash
      if (hash) {
        setTimeout(() => {
          const targetElement = shadowRoot.querySelector(hash)
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' })
          }
        }, 300)
      }
    }, 1000)
  },
  methods: {
  }
}
</script>

<style lang="less" scoped></style>
