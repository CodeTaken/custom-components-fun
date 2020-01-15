function resetPage(opts){
  console.log(opts);
  let options = opts;
  options.onLoadOld = opts.onLoad;
  options.onLoad = function (options) {
    console.log('resetPage');
    this.onLoadOld && this.onLoadOld()
  }



  Page(options)
}



module.exports = {
  resetPage
}