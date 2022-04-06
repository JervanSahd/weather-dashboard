var cityFormEl = document.querySelector('#city-form');
var cityButtonsEl = document.querySelector('#city-buttons');
var cityInputEl = document.querySelector('#cityname');
var repoContainerEl = document.querySelector('#repos-container');
var repoSearchTerm = document.querySelector('#repo-search-term');
var apiKey = "&appid=5e16d9bbe0829f3b60d9e66990bdda0e";


var formSubmitHandler = function (event) {
  event.preventDefault();

  var cityname = cityInputEl.value.trim();

  if (cityname) {
    getcityRepos(cityname);

    repoContainerEl.textContent = '';
    nameInputEl.value = '';
  } else {
    alert('Please enter a City name');
  }
};

var buttonClickHandler = function (event) {
  // `event.target` is a reference to the DOM element of what programming city button was clicked on the page
  var city = event.target.getAttribute('data-city');

  // If there is no language read from the button, don't attempt to fetch repos
  if (city) {
    getFeaturedRepos(city);

    repoContainerEl.textContent = '';
  }
};

var getcityRepos = function (city) {
  var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + "&units=imperial" + apiKey;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          displayRepos(data, city);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to GitHub');
    });
};

var getFeaturedRepos = function (city) {
  // The `q` parameter is what language we want to query, the `+is:featured` flag adds a filter to return only featured repositories
  // The `sort` parameter will instruct openweathermap to respond with all of the repositories in order by the number of issues needing help
  var apiUrl =  'https://api.openweathermap.org/data/2.5/weather?q=' + city + "&units=imperial" + apiKey;

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayRepos(data.items, city);
      });
    } else {
      alert('Error: ' + response.statusText);
    }
  });
};

var displayRepos = function (repos, searchTerm) {
  if (repos.length === 0) {
    repoContainerEl.textContent = 'No repositories found.';
    // Without a `return` statement, the rest of this function will continue to run and perhaps throw an error if `repos` is empty
    
    return;
  }
  repoSearchTerm.textContent = searchTerm;

  for (var i = 0; i < repos.length; i++) {
    // The result will be `<github-cityname>/<github-repository-name>`
    var repoName = repos[i].owner.login + '/' + repos[i].name;

    var repoEl = document.createElement('div');
    repoEl.classList = 'list-item flex-row justify-space-between align-center';

    var titleEl = document.createElement('span');
    titleEl.textContent = repoName;

    repoEl.appendChild(titleEl);

    var statusEl = document.createElement('span');
    statusEl.classList = 'flex-row align-center';

    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + ' issue(s)';
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    repoEl.appendChild(statusEl);

    repoContainerEl.appendChild(repoEl);
  }
};

cityFormEl.addEventListener('submit', formSubmitHandler);
cityButtonsEl.addEventListener('click', buttonClickHandler);
