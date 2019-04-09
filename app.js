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
        f_has_lyrics:true
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
    .then(responseJson => console.log(responseJson.message.body.lyrics.lyrics_body))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}
function getSongInfo(track_list){
  console.log(track_list);
  track_list.forEach(trackObj=>{
    $('#songInfo').append(`
    <li class="music-info">
      <h2 class="artist_name">${trackObj.track.artist_name}</h2>
      <p class="track_name">${trackObj.track.track_name}</p>
      <p class="track_id">${trackObj.track.track_id}</p>
      <button class="getLyricsButton">Get Lyrics</button>
      <button class="getVideoButton">Get Youtube Video</button>
    </li>
    `);
  });
}
function displayVideo(data){
  console.log(data.items[0].snippet.title);
  console.log(data.items[0].snippet.description);
  console.log(data.items[0].snippet.thumbnails.default.url);
  console.log(data.items[0].id.videoId);
}
function getYoutubeVideo(query){
  const params = {
    key: youtubeApiKey,
    q: query,
    part: 'snippet',
    maxResults:1,
    type: 'video'
  };
  const queryString = formatQueryParams(params)
  const url = youtubeSearchURL + '?' + queryString;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayVideo(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });

}
function handleGetYoutubeVideo(){
  $('#songInfo').on('click','.getVideoButton',function(){
    getYoutubeVideo($(this).siblings('.artist_name').text() + " " + $(this).siblings('.track_name').text());
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