/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/calc.js":
/*!****************************!*\
  !*** ./js/modules/calc.js ***!
  \****************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module */
/*! CommonJS bailout: module.exports is used directly at 110:0-14 */
/***/ ((module) => {

function calc(){
       // Calculator

       const result = document.querySelector('.calculating__result span');
    
       let sex, height, weight, age, ratio;
   
       if (localStorage.getItem('sex')) {
           sex = localStorage.getItem('sex');
       } else {
           sex = 'female';
           localStorage.setItem('sex', 'female');
       }
   
       if (localStorage.getItem('ratio')) {
           ratio = localStorage.getItem('ratio');
       } else {
           ratio = 1.375;
           localStorage.setItem('ratio', 1.375);
       }
   
       function calcTotal() {
           if (!sex || !height || !weight || !age || !ratio) {
               result.textContent = '____';
               return;
           }
           if (sex === 'female') {
               result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
           } else {
               result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
           }
       }
   
       calcTotal();
   
       function initLocalSettings(selector, activeClass) {
           const elements = document.querySelectorAll(selector);
   
           elements.forEach(elem => {
               elem.classList.remove(activeClass);
               if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                   elem.classList.add(activeClass);
               }
               if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                   elem.classList.add(activeClass);
               }
           });
       }
   
       initLocalSettings('#gender div', 'calculating__choose-item_active');
       initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');
   
       function getStaticInformation(selector, activeClass) {
           const elements = document.querySelectorAll(selector);
   
           elements.forEach(elem => {
               elem.addEventListener('click', (e) => {
                   if (e.target.getAttribute('data-ratio')) {
                       ratio = +e.target.getAttribute('data-ratio');
                       localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                   } else {
                       sex = e.target.getAttribute('id');
                       localStorage.setItem('sex', e.target.getAttribute('id'));
                   }
       
                   elements.forEach(elem => {
                       elem.classList.remove(activeClass);
                   });
       
                   e.target.classList.add(activeClass);
       
                   calcTotal();
               });
           });
       }
   
       getStaticInformation('#gender div', 'calculating__choose-item_active');
       getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');
   
       function getDynamicInformation(selector) {
           const input = document.querySelector(selector);
   
           input.addEventListener('input', () => {
               if (input.value.match(/\D/g)) {
                   input.style.border = "1px solid red";
               } else {
                   input.style.border = 'none';
               }
               switch(input.getAttribute('id')) {
                   case "height":
                       height = +input.value;
                       break;
                   case "weight":
                       weight = +input.value;
                       break;
                   case "age":
                       age = +input.value;
                       break;
               }
   
               calcTotal();
           });
       }
   
       getDynamicInformation('#height');
       getDynamicInformation('#weight');
       getDynamicInformation('#age');
}

module.exports = calc;

/***/ }),

/***/ "./js/modules/cards.js":
/*!*****************************!*\
  !*** ./js/modules/cards.js ***!
  \*****************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module */
/*! CommonJS bailout: module.exports is used directly at 54:0-14 */
/***/ ((module) => {

function cards(){

    // Используем классы для создание карточек меню

        class MenuCard {
            constructor(src, alt, title, descr, price, parentSelector, ...classes) {
                this.src = src;
                this.alt = alt;
                this.title = title;
                this.descr = descr;
                this.price = price;
                this.classes = classes;
                this.parent = document.querySelector(parentSelector);
                this.transfer = 27;
                this.changeToUAH(); 
            }
    
            changeToUAH() {
                this.price = this.price * this.transfer; 
            }
    
            render() {
                const element = document.createElement('div');
    
                if (this.classes.length === 0) {
                    this.classes = "menu__item";
                    element.classList.add(this.classes);
                } else {
                    this.classes.forEach(className => element.classList.add(className));
                }
    
                element.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
                `;
                this.parent.append(element);
            }
        }
    
        getResource('http://localhost:3000/menu')
            .then(data => {
                data.forEach(({img, altimg, title, descr, price}) => {
                    new MenuCard(img, altimg, title, descr, price, ".menu .container").render();
                });
            });
}

module.exports = cards;

/***/ }),

/***/ "./js/modules/forms.js":
/*!*****************************!*\
  !*** ./js/modules/forms.js ***!
  \*****************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module */
/*! CommonJS bailout: module.exports is used directly at 88:0-14 */
/***/ ((module) => {

function forms(){
    // Forms

    const forms = document.querySelectorAll('form');//выбираем все формы которые у нас есть на странице
    const message = {//возможные сообщения вывода после действий пользователя 
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async(url, data) => {
        const res = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'//тип данных, а именно контент, формат данны и ех кодировка
                },
                body: data//формат записи данных будет в виде строки
        });
        return await res.json();
    };

    async function getResource(url) {
        let res = await fetch(url);
    
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
    
        return await res.json();
    }

    function bindPostData(form) {//функция передачи данных на сервер 
        form.addEventListener('submit', (e) => {//если пользователь дал одобрение на обработку данных то...
            e.preventDefault();//обнуляем стандартное поведение страницы

            let statusMessage = document.createElement('img');//создаем тег картинки в который пометим наш спинер
            statusMessage.src = message.loading;//ссылка на спинер
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;//создаем блок в котором выведится сообщение
            form.insertAdjacentElement('afterend', statusMessage);//в нашей форме добавляем спиннер в саммом конце всего контента 
        
            const formData = new FormData(form); //создаем переменную для хранения нашей введенной информации 
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

           postData('http://localhost:3000/requests', json)
           .then(data => {
                console.log(data);//в консоль выводим нашу базу данных
                showThanksModal(message.success);//выводим сообщение об успешном завершении 
                statusMessage.remove();//убираем наш спинер
           }).catch(() => {
                showThanksModal(message.failure);//или же при другом исходе сообщение об ошибке 
           }).finally(() => {
                form.reset();//форма перезапускатся  
           });
        });
    }

    function showThanksModal(message) {//функция показа модальнго окна 
        const prevModalDialog = document.querySelector('.modal__dialog');//наше предыдущие окно в котором мы вводили данные 

        prevModalDialog.classList.add('hide');//добавляем ему класс скрытия 
        openModal();//обнуляем

        const thanksModal = document.createElement('div');//создаем дивак
        thanksModal.classList.add('modal__dialog');//добавляем ему класс модального окна
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;//весь html который выведет инфу корректно
        document.querySelector('.modal').append(thanksModal);//после подального окна в доке добавляем неш сорс 
        setTimeout(() => {//через 4 секунды проделываем работу с классами что бы окно исчезло
            thanksModal.remove();//убираем окно благодарности
            prevModalDialog.classList.add('show');//старому модальному окну заполения возвращаем его классы 
            prevModalDialog.classList.remove('hide');//
            closeModal();//и только после этого это окно так же закрываем 
        }, 4000);
    }
}

module.exports = forms;

/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module */
/*! CommonJS bailout: module.exports is used directly at 47:0-14 */
/***/ ((module) => {

function modal(){
    // Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),//тег который содержится в нашем мобальном окне 
        modal = document.querySelector('.modal');//класс модального окна

    modalTrigger.forEach(btn => {//каждый елемент содержащий тег при нажатии исользует функцию для открытия модального окна
        btn.addEventListener('click', openModal);
    });

    function closeModal() {//функция закрытия модального окна
        modal.classList.add('hide');//добавляем класс скрытия елемента
        modal.classList.remove('show');//убираем класс показа елемента
        document.body.style.overflow = '';//в стилях обнуляем присвоенные стили 
    }

    function openModal() {//функция открытия модального окна 
        modal.classList.add('show');//добавляем класс отображения 
        modal.classList.remove('hide');//убираем класс скрытия 
        document.body.style.overflow = 'hidden';//добавляем стиль
        clearInterval(modalTimerId);//очищаем интервал времени
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == "") {// если мы нажализа приделы модального окна или на крестик то оно закроется
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {//если нажата клавиша escape то окно закроется 
        if (e.code === "Escape" && modal.classList.contains('show')) { 
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 300000);//через 30 секунд окно появится само по себе 

    function showModalByScroll() {//функция ответственаня за отображение окна когда пользователь проскролит до конца страницы
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    window.addEventListener('scroll', showModalByScroll);
}

module.exports = modal;

/***/ }),

/***/ "./js/modules/slider.js":
/*!******************************!*\
  !*** ./js/modules/slider.js ***!
  \******************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module, __webpack_require__ */
/*! CommonJS bailout: module.exports is used directly at 152:0-14 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const modal = __webpack_require__(/*! ./modal */ "./js/modules/modal.js");

function slider(){
        // Slider 

        let offset = 0;//начальный отступ слайда он его окна
        let slideIndex = 1;//задаем индекс слайда с которого будет идти нумерация 
    
        const slides = document.querySelectorAll('.offer__slide'),
            slider = document.querySelector('.offer__slider'),
            prev = document.querySelector('.offer__slider-prev'),
            next = document.querySelector('.offer__slider-next'),
            total = document.querySelector('#total'),
            current = document.querySelector('#current'),
            slidesWrapper = document.querySelector('.offer__slider-wrapper'),
            width = window.getComputedStyle(slidesWrapper).width,
            slidesField = document.querySelector('.offer__slider-inner');
    
        if (slides.length < 10) {//если номер слайда однозначный добавим 0 перед числом
            total.textContent = `0${slides.length}`;
            current.textContent =  `0${slideIndex}`;
        } else {//если двузначное число то пропускаем
            total.textContent = slides.length;
            current.textContent =  slideIndex;
        } 
    
        
        slidesField.style.width = 100 * slides.length + '%';//задаем общее пространство, так как 4 картинки до 400%
        slidesField.style.display = 'flex';//дисплей флекс, переводим картинки в ряд
        slidesField.style.transition = '0.5s all';//переход от одного к другом 0.5 сек
    
        slidesWrapper.style.overflow = 'hidden';//скрываем весь контент который не принадлежит нашему окну, а именно размеру 1 слайда
    
        slides.forEach(slide => {
            slide.style.width = width;//задаем ширину слайда, для каждой картинки 
        });
    
        slider.style.position = 'relative';
        
        const indicator = document.createElement('ol'),//создаем список через тег
        dots = [];//точки на слайдере в виде пустого масива
    
        indicator.classList.add('.carousel_indicators');//задаем стили точек
        indicator.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
        `;
    
        slider.append(indicator);//вставляем в слайдер
    
        for (let i = 0; i < slides.length; i++){//пока не пройдем все слайды задаем стили точек
            const dot = document.createElement('li');
            dot.setAttribute('data-slide-to', i+1);
            dot.style.cssText = `
        box-sizing: content-box;
        flex: 0 1 auto;
        width: 30px;
        height: 6px;
        margin-right: 3px;
        margin-left: 3px;
        cursor: pointer;    
        background-color: #fff;
        background-clip: padding-box;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        opacity: .5;
        transition: opacity .6s ease;
        `;//добавляем стить точки
        if(i == 0){
            dot.style.opacity = 1;//если первый елемент то его прозрачность меняем
        }
        indicator.append(dot);//добавляем нашу первую точку на начальный слайд
        dots.push(dot);//помещаем в пустой масив наши точки у каждой из которой есть стиль
        }
    
        function addZeroSlide(){//функция добавления нуля 
            if (slides.length < 10) {//если число не двузначное 
                current.textContent =  `0${slideIndex}`;//добавили 0
            } else {
                current.textContent =  slideIndex;//или пропустили
            }
        }
    
        function dotOpacity(){
            dots.forEach(dot => dot.style.opacity = '.5');//прозрачность каждой точки 50%
            dots[slideIndex - 1].style.opacity = 1;//в зависимости он номера индекса слайда точка меняет прозрачность 
        }
    
        function translateXforSlider(){//функция движение по осе х для слайдера
            slidesField.style.transform = `translateX(-${offset}px)`;//перемещаем по осе икс
        }
    
        next.addEventListener('click', () => {
            if (offset == (+width.slice(0, width.length - 2) * (slides.length - 1))) {//если отступ от начала первого слайда будет равен общему отступу до конца картинок минус ширина 1 слайда то при следующем клике вернет на первый слайд делая отступ равным 0
                offset = 0;
            } else {
                offset += +width.slice(0, width.length - 2);// в ином случае приплюсовуем к нашему значению еще один отсутп в один слайд
            }
    
            translateXforSlider();//перемещаем по осе х
    
            if (slideIndex == slides.length) {
                slideIndex = 1;//если номер слайда совпадает с индексом 1, то оставлем его такии же
            } else {
                slideIndex++;//или же увеличиваем на 1 номер индекса
            }
            addZeroSlide();//добавляем 0
            dotOpacity(); //меняем прозрачность выбранной точки 
        });
    
        prev.addEventListener('click', () => {
            if (offset == 0) {//если мы находимся на первом слайде то ...
                offset = +width.slice(0, width.length - 2) * (slides.length - 1);//задаем отступ в до последнего слайда
            } else {
                offset -= +width.slice(0, width.length - 2);//иначе уменьшаем на ширину одного слайда
            }
    
            translateXforSlider();//передвигаемся по осе х
    
            if (slideIndex == 1) {
                slideIndex = slides.length;//если мы на первом слайде то ничего не меняем
            } else {
                slideIndex--;//если мы на 4-2 слайде то уменьшаем на 1
            }
    
            addZeroSlide();//добавляем 0
            dotOpacity();//меняем прозрачность точки слайда
        });
    
        dots.forEach(dot =>{//для каждой кнопки
            dot.addEventListener('click', (e) =>{//назначаем клик
                const slideTo = e.target.getAttribute('data-slide-to');//точка на которую нажали придаем атрибут 
    
                slideIndex = slideTo;//меняем наш индекс
                offset = +width.slice(0, width.length - 2) * (slideTo - 1);//делаем отступ до выбраного слайда
                
                translateXforSlider();//перемещаем по осе х
                addZeroSlide();//добавляем 0
                dotOpacity();//меняем прозрачность выбранной точки
            });
        });
}

module.exports = slider;

/***/ }),

/***/ "./js/modules/tabs.js":
/*!****************************!*\
  !*** ./js/modules/tabs.js ***!
  \****************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module */
/*! CommonJS bailout: module.exports is used directly at 43:0-14 */
/***/ ((module) => {

function tabs(){
    
//Слайды-табы

	let tabs = document.querySelectorAll('.tabheader__item'),//один таб
    tabsContent = document.querySelectorAll('.tabcontent'),//контент внутри одного таба
    tabsParent = document.querySelector('.tabheader__items');//общий контейнер всех табов 

function hideTabContent() {//функция скрытия всех не активных набов на странице
    
    tabsContent.forEach(item => {//для каждого елемента включаещего в себя класс tabcontent добавляем событие
        item.classList.add('hide');//в список классов добавляем класс hide
        item.classList.remove('show', 'fade');//и также убираем классы отвечающие за отображение таба и его размытие
    });

    tabs.forEach(item => {
        item.classList.remove('tabheader__item_active');//методом перебора всех елементов находим таб у которого есть класс отвечающий за отображение всего его совместимого на странице и удаляем
    });
}

function showTabContent(i = 0) {//функия для отобраения контента выбраного таба
    tabsContent[i].classList.add('show', 'fade');//присваиваем классы отображения и размытия 
    tabsContent[i].classList.remove('hide');//убираем класс отвечающий за скрытие контента 
    tabs[i].classList.add('tabheader__item_active');//и добавляем класс отвечающий за отображение всего вместимого 
}

hideTabContent();//вызов для отмены перезагрузки
showTabContent();//вызов для отмены перезагрузки

tabsParent.addEventListener('click', function(event) {//при клике в области кнопок табов выполяем действие 
    const target = event.target;//наше событие присваиваем в переменнную 
    if(target && target.classList.contains('tabheader__item')) {//если при нажатии один из табов содержит выбранный класс то начинаем перебор 
        tabs.forEach((item, i) => {
            if (target == item) {//если выбранный нами елемент в момент перебора всех табов нашелся то 
                hideTabContent();//скрываем все остальные 
                showTabContent(i);//а нашему придаем классы ответственные за отображение
            }
        });
    }
});
}

module.exports = tabs;

/***/ }),

/***/ "./js/modules/timer.js":
/*!*****************************!*\
  !*** ./js/modules/timer.js ***!
  \*****************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module */
/*! CommonJS bailout: module.exports is used directly at 57:0-14 */
/***/ ((module) => {

function timer(){
    // Timer

    const deadline = '2020-11-11';//кастомная дата до которой будет идти акция

    function getTimeRemaining(endtime) {//функция которая будет отвечать за подсчет всех едениц времени
        const t = Date.parse(endtime) - Date.parse(new Date()),//переводим разницу между окончанием времени акции и нашим реалным временем в милисекунды
            days = Math.floor( (t/(1000*60*60*24)) ),//дни
            seconds = Math.floor( (t/1000) % 60 ),//секунды
            minutes = Math.floor( (t/1000/60) % 60 ),//минуты
            hours = Math.floor( (t/(1000*60*60) % 24) );//часы

        return {//возвращаем нам значения после выполнения функции (запись в виде обьекта)
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num){//функция ответственная за добавление нуля в однозначные еденицы времени
        if (num >= 0 && num < 10) { 
            return '0' + num;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {//функция присвоения едениц времени в наш таймер

        const timer = document.querySelector(selector),
            days = timer.querySelector("#days"),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);//обновляем значения наших едениц через каждую секунду методом получения разницы 

        updateClock();//выводим для обнуления показа стандартного значения

        function updateClock() {//функция обновления времени 
            const t = getTimeRemaining(endtime);//передаем наше конечное времея

            days.innerHTML = getZero(t.days);//присваиваем через innetHTML наши зчанения при этом исользуем функцию для добавления нуля если не обходим
            hours.innerHTML = getZero(t.hours);//
            minutes.innerHTML = getZero(t.minutes);//
            seconds.innerHTML = getZero(t.seconds);//

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }
    setClock('.timer', deadline);//передаем селектор таймера и наше конечное число 
}

module.exports = timer;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
(() => {
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: __webpack_require__ */
window.addEventListener('DOMContentLoaded', function() {//когда загрузиться дом дерево будем выполнять функцию (код js)
    
    const tabs = __webpack_require__(/*! ./modules/tabs */ "./js/modules/tabs.js"),
          modal = __webpack_require__(/*! ./modules/modal */ "./js/modules/modal.js"),
          calc = __webpack_require__(/*! ./modules/calc */ "./js/modules/calc.js"),
          cards = __webpack_require__(/*! ./modules/cards */ "./js/modules/cards.js"),
          forms = __webpack_require__(/*! ./modules/forms */ "./js/modules/forms.js"),
          slider = __webpack_require__(/*! ./modules/slider */ "./js/modules/slider.js"),
          timer = __webpack_require__(/*! ./modules/timer */ "./js/modules/timer.js");

    tabs();
    modal();
    calc();
    cards();
    forms();
    slider();
    timer();
});
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map