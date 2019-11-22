function InitPage(opts) {
  let options = opts;

  console.log(options);

  options.onLoadOld = opts.onLoad;
 
  options.onLoad = function (options) {
    console.log('第一次');
  }
  options.onLoadOld()
  options.onShowOld = opts.onShow;
  options.onShow = function (options) {
    console.log('第tt次');
  }
  Page(options)

}

module.exports = {
  InitPage: InitPage
}