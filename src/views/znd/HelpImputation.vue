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
  name: 'HelpImputation',
  components: {
  },
  data() {
    return {
      loading: true,
      htmlStr: `
  <div class="stackedit__html">
<h1 id="help">Help</h1>
<h2 id="introduce">Introduce</h2>
<p>1kCIGP Imputation Server is a genotype imputation server utilizing the 1kCIGP reference panel constructed from The 1000 Chinese Domestic Pig Genomes Project (1KCIGP) dataset. The users can upload their unphased genotypes to the server and receive the phased and imputed genotypes in return. The haplotypes phasing and genotypes imputation will be performed by using SHAPEIT4 and Minimac4.</p>
<p><img src="/znd/Snipaste_2023-08-03_19-00-18.png" alt=""></p>
<h2 id="reference-panel">Reference Panel</h2>
<p>Our server offers imputation with the following reference panels:</p>

<table>
<thead>
<tr>
<th align="center">Item</th>
<th align="center">Content</th>
</tr>
</thead>
<tbody>
<tr>
<td align="center">Description</td>
<td align="center">This reference panel is constructed basing on the 1KCIGP phase1 dataset.</td>
</tr>
<tr>
<td align="center">Number of individuals</td>
<td align="center">1,011</td>
</tr>
<tr>
<td align="center">Genome build</td>
<td align="center">S. scrofa 11.1</td>
</tr>
<tr>
<td align="center">Number of sites</td>
<td align="center">4,583,958</td>
</tr>
<tr>
<td align="center">Chromosomes</td>
<td align="center">chr1-18,X</td>
</tr>
</tbody>
</table><h2 id="getting-started">Getting started</h2>
<h3 id="sign-up">Sign up</h3>
<p>Before using ChinaMAP Imputation Server, you need to have a account and login. You may click here to <a href="http://120.25.231.168:8080/register">register</a> for your account. The server will inform you by email when the imputation tasks are finished or failed, so you need to make sure your email is available.</p>
<p><img src="/znd/Snipaste_2023-08-03_19-02-53.png" alt=""></p>
<h3 id="submit-your-imputation-tasks">Submit your imputation tasks</h3>
<p>You can submit your tasks at the <a href="http://120.25.231.168:8080/imputation">homepage</a>.</p>
<p>The following information is required.</p>
<h4 id="task-name">Task Name</h4>
<p>By default, the name for the imputation task is automatically generated according to the current time, and it can be modified by you when needed.</p>
<h4 id="reference-panel-1">Reference Panel</h4>
<p>Choose which reference panel to use for genotype imputation. We offer the following reference panel:</p>
<p>[1KCIGP.phase1](#Reference Panel)</p>
<p>More details about the available reference panels can be found here.</p>
<h4 id="quality-control">Quality Control</h4>
<p>Choose whether quality control alignment processing is needed. If you choose ‘yes’, we will perform quality control alignment before phase. If you choose ‘no’, you should upload a dataset that has already undergone quality control alignment.</p>
<h4 id="phased">Phased</h4>
<p>Choose whether phase alignment processing is needed. If you choose ‘yes’, we will perform phase alignment before impute. If you choose ‘no’, you should upload a dataset that has already undergone phase alignment.</p>
<h4 id="input-bcf-files">Input BCF Files</h4>
<p>You can upload bcf files from your computer via clicking on Uploading File and selecting files on the dialog appears. Multiple files can be selected simultaneously. If a file is incorrectly selected, you can delete it by clicking the “deleted” icon that appears to the right of this file. We also provide testing data, which can be used for imputation by clicking on Using Demo Data. The data will be uploaded after you click on Submit Task.</p>
<p>⚠️ Please read this tutorial about [data preparation](#data preparation) to ensure your data is in the correct format.</p>
<p>After confirming our terms of service, the imputation task can be started immediately by clicking on Submit Task. You will be informed by email as soon as the job is finished or failed.</p>
<h3 id="view-your-imputation-tasks">View your imputation tasks</h3>
<p>Your task list can be shown by clicking on <a href="http://120.25.231.168:8080/profile">My Profile</a>. You can also customize the time range to view the tasks submitted in a specified period.</p>
<p><img src="/znd/Snipaste_2023-08-03_20-07-26.png" alt=""></p>
<h3 id="download-the-imputation-results">Download the imputation results</h3>
<p>When receive an email notifying that the task is finished, you can click the link in the email to download the results.</p>
<p>⚠️ All data will be preserved on our server only for 3 days.</p>
<h2 id="data-preparation">data preparation</h2>
<h3 id="requirements-of-input-files">Requirements of input files</h3>
<p>Please ensure that your input files meet the following requirements:</p>
<ul>
<li>
<p>The input file is bcf format.</p>
</li>
<li>
<p>The bcf file is sorted by genomic coordinates.</p>
</li>
<li>
<p>S.scrofa 11.1 coordinates are required.</p>
</li>
<li>
<p>The chromosomes should be encoded with prefix ‘chr’ (e.g. chr2).</p>
</li>
<li>
<p>Create separate bcf file for each chromosome.</p>
</li>
<li>
<p>The index of bcf file is unnecessary.</p>
</li>
<li>
<p>Only one file can be uploaded for one chromosome in the same task.</p>
</li>
<li>
<p>Files uploaded at the same time shouldn’t have the same filename. And the filenames shouldn’t contain any special characters and non-ASCII characters.</p>
</li>
<li>
<p>The size of a bcf file shouldn’t exceed 100 MiB.</p>
</li>
<li>
<p>The percentage of sites that are not existed in the 1KCIGP reference panel shouldn’t exceed 50%. Too many such sites may cause QC failure. The list of 1KCIGP reference panel sites can be download here.</p>
</li>
</ul>
<h2 id="data-security-and-privacy">Data Security and Privacy</h2>
<ul>
<li>
<p>All steps (data transfer, data analysis, data storage) are executed on a secure server, hosted on Tencent Cloud, located in Shanghai, China.</p>
</li>
<li>
<p>All nodes for imputation compute can only be accessed on a local area network and only administrators can log in.</p>
</li>
<li>
<p>Users can only view their own tasks and data.</p>
</li>
<li>
<p>All data is preserved on our server only for 3 days. After the imputation is finished or failed, all results will be deleted in 3 days.</p>
</li>
<li>
<p>We only store the number of samples and markers for analyzing. We will never “look” at your data in anyway.</p>
</li>
</ul>
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
