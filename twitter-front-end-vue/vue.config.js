module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/twitter-front-end-vue/'
    : '/',
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
        @import "~@/assets/sass/variables.scss";
        @import "~@/assets/sass/mixin.scss";
        `
      },
    }
  }
}
