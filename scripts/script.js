const formElem = document.forms[0];


const get_deals = () => JSON.parse(localStorage.getItem('deals')) || [];
get_deals();
const get_dealsStatus = () => JSON.parse(localStorage.getItem('deals_status')) || { done: 0, deny: 0 };

const add_deal = deal => localStorage.setItem('deals', JSON.stringify([...get_deals(), deal]));
const remove_deal = deal => {
	const new_list = get_deals().filter(elem => JSON.stringify(elem) !== JSON.stringify(deal));
	localStorage.setItem('deals', JSON.stringify(new_list));
}

const add_pos_status = () => {
	const deals_status = get_dealsStatus();
	deals_status.done++;
	localStorage.setItem('deals_status', JSON.stringify(deals_status));
}
const add_neg_status = () => {
	const deals_status = get_dealsStatus();
	deals_status.deny++;
	localStorage.setItem('deals_status', JSON.stringify(deals_status));
}


formElem.addEventListener('submit', event => {
	event.preventDefault();
	const { title, description } = event.target;
	if (title.value !== '') {
		add_deal({
			title: title.value,
			description: description.value
		});
	} else {
		alert('Вы не ввели название!');
	}
	render(get_deals());
	title.value = '';
	description.value = '';
})

function render(lst) {
	const posElem = document.querySelector('.pos span')
	const negElem = document.querySelector('.neg span')
	const { done, deny } = get_dealsStatus();
	posElem.innerText = done;
	negElem.innerText = deny;



	const dealsElem = document.querySelector('#deals');
	dealsElem.innerText = '';
	dealsElem.append(
		...get_deals().map(deal => {
			const { title, description } = deal;
			const rootElem = document.createElement('div');
			const infoElem = document.createElement('div');
			infoElem.classList.add('info');
			rootElem.classList.add('deal');

			const titleElem = document.createElement('div');
			const descrElem = document.createElement('div');
			titleElem.innerText = title;
			descrElem.innerText = description;
			infoElem.append(titleElem, descrElem);

			const BtnElem = document.createElement('div');
			BtnElem.classList.add('trigger');
			const okBtnElem = document.createElement('div');
			const denBtnElem = document.createElement('div');
			okBtnElem.classList.add('ok')
			denBtnElem.classList.add('neg')
			BtnElem.append(okBtnElem, denBtnElem);

			rootElem.append(infoElem, BtnElem);

			okBtnElem.addEventListener('click', () => {
				add_pos_status();
				remove_deal(deal);
				render();

			});
			denBtnElem.addEventListener('click', () => {
				add_neg_status();
				remove_deal(deal);
				render();
			});

			return rootElem;
		})
	)
}

render(get_deals());