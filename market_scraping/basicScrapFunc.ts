export async function basicScrap(page: any, word: string) {
  let result = await page.evaluate((word: any) => {
    let searchItem: string[] = [];
    document.querySelectorAll(word).forEach((element: any) => {
      searchItem.push(element.innerText);
    });
    return searchItem;
  }, word);
  return result;
}
