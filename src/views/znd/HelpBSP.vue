<template>
  <div class="flex-auto flex flex-col bg-white rounded-3xl p-8">
    <div ref="container"></div>
  </div>
</template>

<script>
export default {
  name: 'HelpBSP',
  components: {
  },
  data() {
    return {
      htmlStr: `
<div class="stackedit__html"><p></p><div class="toc"><h3>BSP</h3><ul><li><a href="#Introduction_1">Introduction</a></li><li><a href="#Module_1_The_database_of_specific_SNPs_3">Module 1: The database of specific SNPs</a></li><ul><li><a href="#The_meaning_of_each_column_in_the_table_14">The meaning of each column in the table</a></li></ul><li><a href="#Module_2_Breed_prediction_22">Module 2: Breed prediction</a></li><li><a href="#Module_3_Estimation_of_potential_ancestors_31">Module 3: Estimation of potential ancestors</a></li><ul><li><a href="#Interpretation_of_results_37">Interpretation of results</a></li></ul><li><a href="#The_operation_for_Breed_Prediction_based_on_Custom_SNPs_48">The operation for Breed Prediction based on Custom SNPs.</a></li><li><a href="#FAQ_60">FAQ</a></li></ul></div><p></p>
<h1><a id="Introduction_1"></a>Introduction</h1>
<p>BARCODE SNPs for Pig (BSP), a  database of specific SNPs for indigenous pigs worldwide. It also supplies quick and precise tools for predicting the breed or population a given individual belongs to, and their potential ancestors.</p>
<h1><a id="Module_1_The_database_of_specific_SNPs_3"></a>Module 1: The database of specific SNPs</h1>
<blockquote>
<p>Search and download infomation of Breed-specific SNPs for analysis and custom breed predictions</p>
</blockquote>
<p>It contains the information of breed-specific SNPs on autosomes. The study proposes to analyze the 1406 samples with ~132 million raw SNPs from 50 Chinese native breeds and 10 foreign breeds.</p>

<table>
<thead>
<tr>
<th>Class</th>
<th>Breeds</th>
</tr>
</thead>
<tbody>
<tr>
<td>Chinese native breeds</td>
<td>Diannan Small-ear pig, Huai pig(Fujian Province), Debao pig, Bama Xiang pig, Liangguang Small-spotted pig, Xiang pig, Qianshao Spotted pig, Large Black-white pig, Wuzhishan pig, Lantang pig, Hainan pig, Yuedong Black pig, Dapulian pig, Min pig, Laiwu pig, Huainan pig, Dingyuan pig, Xiangxi Black pig, Mashen pig, Anqing Six-end-white pig, Bamei pig, Ganxi Two-end-black pig, Tongcheng pig, Ningxiang pig, Daweizi pig, Shaziling pig, Qingping pig, Dongshan pig, Erhualian pig, Mi pig, Shengxian Spotted pig, Leping pig, Jinhua pig, Jiangquhai pig, Jianli pig, Wannan Black pig, Pudong White pig, Hetao pig, Meishan pig, Jiaxing Black pig, Shawutou pig, Putian pig, Rongchang pig, Saba pig, Wujin pig, Yujiang pig, Hanjiang Black pig, Neijiang pig, Tibetan wild boar(Si chuan), Tibetan wild boar(Tibet)</td>
</tr>
<tr>
<td>Foreign breeds</td>
<td>Jeju Black pig, Iberian, Mangalica, Yucatan miniature pig, Pietrain, Landrace, Hampshire, Yorkshire, Duroc, Berkshire</td>
</tr>
</tbody>
</table><h2><a id="The_meaning_of_each_column_in_the_table_14"></a>The meaning of each column in the table</h2>
<p>Breed： Chinese native breeds and foreign breeds (multiple choices)<br>
Rs ID: SNP identification number in the pig variation database<br>
Chromosome: Chromosome number (excluding sex chromosomes)<br>
Position: SNP locations on chromosomes<br>
Ref: Reference allele<br>
Alt:  alternative allele<br>
<img src="https://img-blog.csdnimg.cn/ba326cad42194a85a85ff4e6518a964d.png" alt="在这里插入图片描述"></p>
<h1><a id="Module_2_Breed_prediction_22"></a>Module 2: Breed prediction</h1>
<blockquote>
<p>Breed prediction based on Custom SNPs or Low Density Full Library SNPs</p>
</blockquote>
<p>If select based on full library to Predict the breed of the sample, the SNPs must meet the Low Density Full Library Location (Click the green button to download).<br>
Upload the plink file, and file format details can be found in <a href="https://zzz.bwh.harvard.edu/plink/data.shtml#:~:text=PLINK%20is%20a%20command%20line%20program%20written%20in,results%20are%20written%20to%20files%20with%20various%20extensions.">Plink 1.9</a><br>
<img src="https://img-blog.csdnimg.cn/496078da53574905b36ab96f0cf812b6.png" alt="在这里插入图片描述"><br>
If you select based on Custom SNPs, the file to be uploaded must match the breed-specific SNPs downloaded from The database of specific SNPs. The selection of breeds to be predicted also needs to be consistent with the previous analysis. The specific operation process can be seen in The operation for Breed Prediction based on Custom SNPs.<br>
<img src="https://img-blog.csdnimg.cn/21b941266423467080a8e3edd8e8f897.png" alt="在这里插入图片描述"></p>
<h1><a id="Module_3_Estimation_of_potential_ancestors_31"></a>Module 3: Estimation of potential ancestors</h1>
<blockquote>
<p>Determine whether the sample is a breed in the database, a pure breed not in the database, or a hybrid<br>
Estimate potential ancestors of samples</p>
</blockquote>
<p>As shown in the figure, the file to be uploaded must meet the High Density Full Library Location.<br>
<img src="https://img-blog.csdnimg.cn/7f2235f37b2a4d67a82a1ab89893d012.png" alt="在这里插入图片描述"></p>
<h2><a id="Interpretation_of_results_37"></a>Interpretation of results</h2>
<p>The output includes the following</p>
<ul>
<li><strong>sampleNo</strong>: Sample Name</li>
<li><strong>Judgment</strong>: Determine whether it is a hybrid/NonHybrid</li>
<li><strong>Prediction accuracy</strong>: This column outputs the accuracy of the judgment</li>
<li><strong>Prediction Breed</strong>: If Judgment is Non Hybrid and the sample is predicted to be purebred in the library, this columns will output predicted breeds.</li>
<li><strong>Prediction accuracy for Prediciton Breed</strong>: If Judgment is Non Hybrid and the sample is predicted to be purebred in the library, this columns will output the accuracy of breed prediction. Otherwise, it is empty.</li>
<li><strong>Ancestor name 1-6</strong>: If Judgment is Hybrid, the estimation of ancestor proportion will run. The number of Ancestors is at most 6.</li>
<li><strong>Ancestor proportion 1-6</strong>: The proportion of ancestry components corresponding to ancestral names<br>
<img src="https://img-blog.csdnimg.cn/f80581975ace480daadf9dd70c7bb357.png" alt="在这里插入图片描述"></li>
</ul>
<h1><a id="The_operation_for_Breed_Prediction_based_on_Custom_SNPs_48"></a>The operation for Breed Prediction based on Custom SNPs.</h1>
<ol>
<li>Choose the breed you want to judge</li>
<li>Download breed-specific SNP details<br>
<img src="https://img-blog.csdnimg.cn/8641883e33d843939ccdd248aa94a512.png" alt="在这里插入图片描述"></li>
<li>Extract the loci contained in the downloaded file in Step 2</li>
<li>Choose based on Custom SNPS</li>
<li>Choose the breed in Step1</li>
<li>Upload files and create the process</li>
</ol>
<p><img src="https://img-blog.csdnimg.cn/b1ac3e3cd9ce48cdb7458b36e9e2902e.png" alt="在这里插入图片描述"></p>
<h1><a id="FAQ_60"></a>FAQ</h1>
</div>
      `
    }
  },
  computed: {
  },
  created() {
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
    const hash = window.location.hash
    if (hash) {
      setTimeout(() => {
        const targetElement = shadowRoot.querySelector(hash)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' })
        }
      }, 500)
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped></style>
