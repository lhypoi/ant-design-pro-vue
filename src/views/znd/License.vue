<template>
  <div class="flex-auto flex bg-white rounded-3xl p-8">
    <div class="w-full">
      <div class="container mx-auto p-4">
        <h1 class="text-4xl font-bold text-center pt-2 pb-5">{{ article.title }}</h1>
        <div class="border-t border-gray-300 my-4"></div>
        <div v-for="(section, index) in article.sections" :key="index">
          <h2 :id="'license-section' + index" class="text-2xl font-bold pt-4 pb-1">{{ section.title }}</h2>
          <p v-for="(item, index2) in section.content" :key="index2" class="text-gray-500 pt-2 pb-1 text-xl indent-6">{{ item }}</p>
        </div>
        <h2 class="text-3xl font-bold pt-10 pb-1">You’ve already agreed to these terms.</h2>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'License',
  components: {
  },
  data() {
    return {
      article: {
        title: `Terms of Use`,
        sections: [
          {
            title: '1. Definitions.',
            content: [
              `1.1 "License" shall mean the terms and conditions for use as defined by Sections 1 through 4 of this document.`,
              `1.2 "You" (or "Your") shall mean Legal Entity (possibly an individual) exercising permissions granted by this License.`
            ]
          },
          {
            title: '2. Registration Requirements',
            content: [
              `2.1 The information you fill in should be authentic;`,
              `2.2 For academic research, educational or training purposes provided that You are a recognized academic research institution which is not a hospital, or a registered student at such an institution. `,
              `2.3 You should register with a non-public domain email address, such as your University or academic research institution email address;`,
              `2.4 You can only register for one account;`,
              `2.5 Your registered account is for academic research only;`,
              `2.6 If we find that your account is violated, we would have the right to limit your using, including but not limited to your account;`
            ]
          },
          {
            title: '3. Limitations on Use',
            content: [
              `3.1 You agree to use data for non-commercial research purposes only;`,
              `3.2 You agree that you will not attempt to link the data provided to a third-party database;`,
              `3.3 You agree not to transfer or disclose all or part of the data to others. Instead, please direct them to this website;`,
              `3.4 You accept any part of the data provided by the project team, the original data creator, the copyright owner, etc.;`,
              `3.5 You understand and acknowledge that data is protected by copyright and other intellectual property rights. Providers shall have the sole right to prosecute patents and patent application claiming or covering unauthorized data and Inventions;`,
              `3.6 You accept that this agreement will terminate immediately after you violate this agreement, and you will be required to destroy any data you hold;`,
              `3.7 You accept that it may be necessary for the project team or its designated agent to change the terms of this agreement from time to time to solve new problems. Providers reserve the right to change these terms at any time without prior notice. Use of this website will be subject to the terms of use of the latest version published on this website;`
            ]
          },
          {
            title: '4. Acknowledgment',
            content: [
              `If you use data in 1KCIGP, you should quote papers from the 1KCIGP in your publication.`
            ]
          }
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
