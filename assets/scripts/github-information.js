const userInformationHTML = user => {
    return `
        <h2>
        ${user.name}
            <span class="small-name">
                (@<a href="${user.html_url}" target="_blank">${user.login})</a>
            </span>
        </h2>
        <div class="gh-content">
            <div class="gh-avatar">
                <a href="${user.html_url}" target="_blank">
                    <img src ="${user.avatar_url}" width="80px" height="80px" alt ="${user.login}"> 
                </a>
            </div>
            <p>Followers: ${user.followers} - Following: ${user.following} <br> Repos: ${user.public_repos}</p>
        </div>`
}

const repoInformationHTML = repos => {
    if(repos.lenght === 0) {
        return `<div class="clearfix repo-list">No repos!</div>`;
    }

    let listItemsHTML = repos.map(repo => {
        return `<li>
                    <a href="${repo.html_url}" traget="_blank">${repo.name}</a>
                </li>`;
    });

    return `<div class="clearfix repo-list">
                <p>
                    <strong>Repo List:</strong>
                </p>
                <ul>
                    ${listItemsHTML.join("\n")}
                </ul>
            </div>`;
}



const fetchGitHubInformation = event => {
    $('#gh-user-data').html("")
    $('#gh-repo-data').html("")
    let username = $("#gh-username").val();
    if(!username) {
        $('#gh-user-data').html(`<h2>Please enter a GitHub username</h2>`);
        return;
    }

    $('#gh-user-data').html(`
    <div id="loader">
    <img src="assets/css/loader.gif" alt="loading...">
    </div>`)

    $.when(
        $.getJSON(`https://api.github.com/users/${username}`),
        $.getJSON(`https://api.github.com/users/${username}/repos`)
    ).then(
        (firstResponse, secondResponse) => {
            let userData = firstResponse[0];
            let repoData = secondResponse[0];

            $('#gh-user-data').html(userInformationHTML(userData));
            $('#gh-repo-data').html(repoInformationHTML(repoData));
        }, errorResponse => {
            if(errorResponse.status === 404) {
                $('#gh-user-data').html(`<h2>No info found for user ${username}</h2>`);
            } else if (errorResponse.status === 403) {
                var resetTime = new Date(errorResponse.getResponseHeader('X-RateLimit-Reset') * 1000);
                $("#gh-user-data").html(`<h4>Too many requests, please wait until ${resetTime.toLocaleTimeString()}</h4>`);
            } else {
                console.log(errorResponse);
                $('#gh-user-data').html(`<h2>Error: ${errorResponse.responseJSON.message}</h2>`);
            }
        }
    )
}

$(document).ready(fetchGitHubInformation);