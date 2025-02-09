export const measureTextWidth = (text: string, font: string | undefined) => {
  console.log(font);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context != null){
    context.font = font || getComputedStyle(document.body).font;
    return context.measureText(text).width;
  }else{
    return 0;
  }
}