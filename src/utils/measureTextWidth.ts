export const measureTextWidth = (text: string, font: string | undefined, padding: number = 0) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context != null){
    context.font = font || getComputedStyle(document.body).font;
    return context.measureText(text).width + padding * context.measureText("0").width;
  }else{
    return 0;
  }
}