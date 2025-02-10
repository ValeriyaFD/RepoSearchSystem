
document.addEventListener('DOMContentLoaded', function () {
    const repoSearch = document.getElementById('repoSearch');
    const autocompleteResults = document.getElementById('autocompleteResults');
    const repoList = document.getElementById('repoList');

    //Завожу переменную для задержки
    let debounceTimeout;

    //Прописываю обработчик ввода в поле поиска
    repoSearch.addEventListener('input', function (e) {
        clearTimeout(debounceTimeout);
        const query = e.target.value.trim();

        if (!query) {
            autocompleteResults.innerHTML = '';
            autocompleteResults.style.display = 'none';
            return;
        }

        //Здесь прописываю ограничение по времени для запросов
        debounceTimeout = setTimeout(() => {
            fetchRepositories(query);
        }, 300);
    });

    //Создаю функцию для запроса API из GitHub
    function fetchRepositories(query) {
        fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayAutocomplete(data.items);
            })
            .catch(error => {
                console.log(error);
            });
    }

    //Здесь прописываю отображение репозиториев из поисковой строки
    function displayAutocomplete(repositories) {
        autocompleteResults.innerHTML = '';
        if (repositories.length > 0) {
            repositories.forEach(repo => {
                const li = document.createElement('li');
                li.textContent = repo.name;
                li.addEventListener('click', () => {
                    addRepositoryToList(repo);
                    repoSearch.value = '';
                    autocompleteResults.innerHTML = '';
                    autocompleteResults.style.display = 'none';
                });
                autocompleteResults.appendChild(li);
            });
            autocompleteResults.style.display = 'block';
        } else {
            autocompleteResults.style.display = 'none';
        }
    }

    //Создаю функцию для добавления выбранного репозитория в список (историю)
    function addRepositoryToList(repo) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>
            Name: ${repo.name} <br>
            Owner: ${repo.owner.login} <br>
            Stars: ${repo.stargazers_count}
            </span>
            <button onclick="removeRepository(this)">
            <img src="img/Vector 7.svg" class='one'>
            <img src="img/Vector 8.svg" class='two'>
            </button>
        `;
        const firstChild = repoList.firstElementChild;
        repoList.insertBefore(li, firstChild);
    }

    //Прописываю удаление репозитория из списка (истории)
    window.removeRepository = function (button) {
        const li = button.parentElement;
        repoList.removeChild(li);
    };
});