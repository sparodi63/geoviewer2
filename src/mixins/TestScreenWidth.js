export default {
  data() {
    const screenWidth = document.documentElement.clientWidth;
    const maxScreenWidth = 420;
    const largeScreen = screenWidth > maxScreenWidth;

    return {
      screenWidth: screenWidth,
      maxScreenWidth: maxScreenWidth,
      largeScreen: largeScreen,
    };
  },
  mounted() {
    // console.log('screenWidth', this.screenWidth)
    // console.log('maxScreenWidth', this.maxScreenWidth)
    // console.log('largeScreen',this.largeScreen)
  },
};
