// API URL
const api_url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

// GET DATA FROM API BY DEFINING ASYNC FUNCTION
async function getAPI(url) {
  // STORING RESPONSE
  const response = await fetch(url);

  // STORING DATA IN THE FORM OF JSON
  var data = await response.json();
  console.log(data);
  renderData(data);
}

function renderData(data) {
  console.log("In renderData(data).");

  // CREATE OUR VARIABLES
  const dataset = data["data"];
  //console.log(dataset);
  dataset.map(element => {
    element[0] = new Date(element[0] + "T00:00");
    //console.log(typeof element[0]);
    //console.log(element);
  });
  console.log(dataset);
  const w = 720;
  const h = 600;

  // MAKE SCALES
  const padding = 40;

  const xScale = d3.scaleTime().
  domain([d3.min(dataset, d => d[0]), d3.max(dataset, d => d[0])]).
  range([padding, w - padding]);

  const yScale = d3.scaleLinear().
  domain([0, d3.max(dataset, d => d[1])]).
  range([h - padding, padding]);

  // CREATE SVG
  const svg = d3.select("#main-doc").
  append("svg").
  attr("width", w).
  attr("height", h);

  // CREATE BARS

  svg.selectAll("rect").
  data(dataset).
  enter().
  append("svg").
  append("rect").
  attr("class", "bar").
  attr("x", d => xScale(d[0])).
  attr("y", d => yScale(d[1])).
  attr("width", 4).
  attr("height", (d, i) => yScale(0) - yScale(d[1])).
  attr("data-date", d => d3.timeFormat("%Y-%m-%d")(d[0])).
  attr("data-gdp", d => d[1]);

  // CREATE TOOLTIPS
  // ADD TO A BODY/DIV OUTSIDE OF THE GRAPHIC'S SVG BECAUSE WE WANT MOUSE POSITION TO TRACK IT NOT-WITHIN THE SVG
  d3.select("#main-doc").
  append("div").
  attr("id", "tooltip").
  style("position", "absolute");

  d3.select("svg").
  selectAll("rect").
  data(dataset).
  join("rect").
  on("mouseover", function (e, d) {
    const [x, y] = d3.pointer(e);
    d3.select("#tooltip").
    style("visibility", "visible").
    style("left", x + 10 + "px").
    style("top", y + 10 + "px").
    attr("data-date", d3.select(this).attr("data-date")).
    attr("data-gdp", d3.select(this).attr("data-gdp")).
    text('Date: ' + d3.select(this).attr("data-date") + ', GDP: ' + d3.select(this).attr("data-gdp") + ' trillion USD');
  }).
  on("mouseout", function () {
    d3.select("#tooltip").
    style("visibility", "hidden");
  });

  // MAKE AXES
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  // APPEND AXES
  svg.append("g").
  attr("id", "x-axis").
  attr("transform", "translate(0," + (h - padding) + ")").
  call(xAxis);

  svg.append("g").
  attr("id", "y-axis").
  attr("transform", "translate(" + padding + ", 0)").
  call(yAxis);
}

// CALL GETAPI(API_URL)
getAPI(api_url);