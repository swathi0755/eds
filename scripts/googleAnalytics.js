function googleAnalytics(){
    const noscript = document.createElement("noscript");
    noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NW2S362N"
                                                        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`;

    document.body.prepend(noscript);

}

export {
  googleAnalytics
}