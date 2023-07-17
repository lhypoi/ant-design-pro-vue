<template>
  <div class="flex-auto flex flex-col bg-white rounded-3xl p-8">
    <h1 class="text-4xl font-bold text-center pt-2 pb-5">{{ article.title }}</h1>
    <div class="border-t border-gray-300 my-4"></div>
    <p v-for="(item, index) in article.content" :key="index" class="text-gray-500 pt-4 pb-5 text-xl indent-6">{{ item }}</p>
  </div>
</template>

<script>
export default {
  name: 'Info',
  components: {
  },
  data() {
    return {
      article: {
        title: `The 1000 Chinese Domestic Pig Genomes Project`,
        content: [
          `With the developments of sequencing technology, the costs of sequencing were sharply reduced. The application of porcine genetics in a comprehensive way, facilitated by whole-genome sequencing of large cohorts, provides a systematic approach to study the genes and pathways that can be used for pig breeding.`,
          `Nowadays, numerous studies have successfully obtained genome sequencing data from different pig breeds worldwide. However, However, some of these datasets contain samples with low sequencing depth, which compromises the accuracy and quantity of variant detection. Especially, Chinese domestic pigs represent more than one-third of Asian pig breeds and exhibit distinct genomic features as highlighted in previous investigations. Nevertheless, the establishment of a representative, standardized, and systematic Chinese domestic pig population cohort remains elusive. Considering the aforementioned challenges in pig genetics and breeding research, large-scale and comprehensive Chinese domestic pig genomic database is urgently needed.`,
          `To address the above issues, we have established a biobank containing 1,011 individuals distributed across 21 provinces, encompassing over half of the regions in China. The 1000 Chinese Domestic Pig Genomes Project (1KCIGP) aims to augment the genomic database with more than 1,000 deep whole-genome sequencing data of Chinese indigenous pigs. The goal of 1KCIGP is to identify Chinese domestic pig’s common variants and low frequency, high impact variants in novel genes and pathways associated with important economic traits. Simultaneously, the 1KCIGP provides a Chinese domestic reference panel for imputation and a BARCODE SNPs for Pig (BSP) system to identify the pig breed. Thus, the 1KCIGP presents a great opportunity to discover important candidate genetic marks and genes, contributing to advancements in pig breeding and benefiting China as well as the global community.`
        ]
      }
    }
  },
  computed: {
  },
  created() {
  },
  async mounted() {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped></style>
