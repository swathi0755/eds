import { createOptimizedPicture } from '../../scripts/aem.js';
export default function decorate(block) {
const cmp_hero = document.createElement('div');
   cmp_hero.setAttribute('class','cmp-hero');
    const hero__container = document.createElement('div');
       hero__container.setAttribute('class','hero__container');

    const hero__image = document.createElement('div');
       hero__image.setAttribute('class','hero__image');

    const hero__content_wrapper = document.createElement('div');
       hero__content_wrapper.setAttribute('class','hero__content-wrapper');

    const hero__content = document.createElement('div');
       hero__content.setAttribute('class','hero__content');

    const hero__border = document.createElement('span');
       hero__border.setAttribute('class','hero__border');

    const hero__button_wrapper = document.createElement('div');
       hero__button_wrapper.setAttribute('class','hero__button-wrapper');

function createBtn(btnEl,btnCls){
       const button__light__fill = document.createElement('div');
            button__light__fill.setAttribute('class',btnCls);
              const primaryBtn = btnEl;
              primaryBtn.setAttribute('class','button__bdl');

const span_icon_circle_right = document.createElement('span');
                    span_icon_circle_right.setAttribute('class','icon icon_circle_right');
                    primaryBtn.append(span_icon_circle_right);
const span_button__text = document.createElement('span');
                     span_button__text.setAttribute('class','button__text');
                     span_button__text.textContent = primaryBtn.textContent;
                     primaryBtn.textContent = '';
                     primaryBtn.append(span_button__text);
const span_icon_angle_right = document.createElement('span');
                    span_icon_angle_right.setAttribute('class','icon icon_angle_right');
                    primaryBtn.append(span_icon_angle_right);

const span_icon_circle_left = document.createElement('span');
                    span_icon_circle_left.setAttribute('class','icon icon_circle_left');
                    primaryBtn.append(span_icon_circle_left);
button__light__fill.append(primaryBtn);
                         hero__button_wrapper.append(button__light__fill)
     }
[...block.children].forEach((row) => {
     row.querySelectorAll('div').forEach((it) => {
if(it && it.textContent && it.textContent.toLowerCase() === 'bgimage'){
            const bgImg = it.nextElementSibling.querySelector('picture')
            const src = bgImg.querySelector('img').src
            cmp_hero.setAttribute('style','--hero-bg:url('+src+')')
       }
       else if(it && it.textContent && it.textContent.toLowerCase().search('primary')>-1){
            const primaryBtn = it.nextElementSibling.querySelector('a');
             createBtn(primaryBtn,'button button__light__fill normal icon__right btn_comp');
       }
       else if(it && it.textContent && it.textContent.toLowerCase() === 'image'){
           hero__image.append(it.nextElementSibling.firstElementChild);
       }
       else if(it && it.textContent && it.textContent.toLowerCase().search('secondary')>-1){
            const primaryBtn = it.nextElementSibling.querySelector('a');
             createBtn(primaryBtn,'button button__light__nofill normal icon__right btn_comp');
       }
       else if(it && it.textContent && it.textContent.toLowerCase() === 'title'){
           hero__content.append(it.nextElementSibling.firstElementChild);
       }
       else if(it && it.textContent && it.textContent.toLowerCase() === 'caption'){
           hero__content.append(it.nextElementSibling);
       }
       else if(it && it.textContent && it.textContent.toLowerCase().search('ctaLink')>-1){
            const primaryBtn = it.nextElementSibling.querySelector('a');
             createBtn(primaryBtn,'button button__light__noborder normal icon__right btn_comp');
       }
})
   })
    hero__content.append(hero__button_wrapper);
    hero__content.append(hero__border);
    hero__content_wrapper.append(hero__content);
    hero__container.append(hero__image);
    hero__container.append(hero__content_wrapper);
    cmp_hero.append(hero__container);
   block.replaceChildren(cmp_hero);
}