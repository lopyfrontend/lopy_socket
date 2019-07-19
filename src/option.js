class Option {
  length= 0 ;

  bufferZoneMaxLength = 1024 * 1024;

  dataMaxLength = 1024 * 512;

  static fromObject(object){
    let option = new Option();

    Object.keys(option).forEach(v => {
      if (typeof object[v] == "undefined") {
        return;
      }

      option[v] = object[v];
    });

    return option;

  }

  static defaultOption(){
    return Option.fromObject({
      length:1024
    });
  }
}


export {Option};