'use strict'

const musixMatchApiKey = '18b2db314b4ef2be9c11ec52568a51e2';
const musixMatchTrackUrl = 'https://api.musixmatch.com/ws/1.1/track.search';
const musixMatchLyricsUrl='https://api.musixmatch.com/ws/1.1/track.lyrics.get'

const youtubeApiKey = 'AIzaSyAwnrZEpsOnApIIpD6ytoPyozSxzFTihaU'; 
const youtubeSearchURL = 'https://www.googleapis.com/youtube/v3/search';

//bypass the Access-Control-Allow-Origin error
const bypassMusixMatchCors = 'https://cors-anywhere.herokuapp.com/';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function searchForLyrics(query){
    const params = {
        q: query,
        apikey: musixMatchApiKey,
        s_track_rating:'desc',
        format:"json",
        f_has_lyrics:true,
        page_size:9,
      };
    
      const queryString = formatQueryParams(params);

      let urlQuery = musixMatchTrackUrl +"?"+queryString;

      fetch(bypassMusixMatchCors+urlQuery)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response);
        })
        .then(responseJson =>{
          getSongInfo(responseJson.message.body.track_list)})
        .catch(err => {
          $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function getLyrics(trackId){
  const params = {
    apikey: musixMatchApiKey,
    track_id:trackId
  };

  const queryString = formatQueryParams(params);

  let urlQuery = musixMatchLyricsUrl +"?"+queryString;

  fetch(bypassMusixMatchCors+urlQuery)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response);
    })
    .then(responseJson => {
      $('#lyrics_text').text(responseJson.message.body.lyrics.lyrics_body)
    })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}
function getSongInfo(track_list){
  if(track_list.length>0){
    track_list.forEach(trackObj=>{
      $('#songInfo').append(`
      <li class="music-info">
        <h2 class="artist_name">${trackObj.track.artist_name}</h2>
        <p class="track_name">${trackObj.track.track_name}</p>
        <p class="track_id hidden">${trackObj.track.track_id}</p>
        <p class="track_share_url hidden">${trackObj.track.track_share_url}</p>
        <button class="getVideoButton"> > View Lyrics</button>
      </li>
      `);
    });
  }else{
    console.log('removing class');
    $('.js-error-message').text('There were no matching results for your search query' );
    $('.js-error-message').removeClass("hidden");
  }
}
function displayVideo(data,id,url){
  $('#songInfo').empty();
  $('#songInfo').append(`<li class="lyrics-info">
    <h2>${data.items[0].snippet.title}</h2>
    <a href="http://www.youtube.com/watch?v=${data.items[0].id.videoId}&amp;feature=player_embedded" target="_blank"><img src="${data.items[0].snippet.thumbnails.high.url}" alt="${data.items[0].snippet.title}"/><br/>Watch on YouTube</a>
    <p id="lyrics_text"></p>
    <a href="${url}" target="_blank">See Full Lyrics</a></li>
  `);
  getLyrics(id);
}
function getYoutubeVideo(query,id,url){
  const params = {
    key: youtubeApiKey,
    q: query,
    part: 'snippet',
    maxResults:1,
    type: 'video',
    videoEmbeddable:"true"
  };
  const queryString = formatQueryParams(params)
  const queryUrl = youtubeSearchURL + '?' + queryString;

  fetch(queryUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayVideo(responseJson,id,url))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });

}
function handleGetYoutubeVideo(){
  $('#songInfo').on('click','.getVideoButton',function(){
    getYoutubeVideo($(this).siblings('.artist_name').text() + " " + $(this).siblings('.track_name').text(),$(this).siblings('.track_id').text(),$(this).siblings('.track_share_url').text());
  });
}
function handleGetLyrics(){
  $('#songInfo').on('click','.getLyricsButton',function(){
    getLyrics($(this).siblings('.track_id').text());
  });
}
function handleSearch(){
    $('#searchArea').on('submit',event=>{
        event.preventDefault();
        let queryText = $('#songSearch').val();
        $('#songInfo').empty();
        searchForLyrics(queryText);
    });
}

function handleClicks(){
  handleSearch();
  handleGetLyrics();
  handleGetYoutubeVideo();
}
$(handleClicks);