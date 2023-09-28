const radialviz = document.querySelector("#radialviz")

// define dimensions and margins for the graphic
const margin = ({ top: 100, right: 50, bottom: 100, left: 80 })
const width = radialviz.offsetWidth;
const height = radialviz.offsetHeight
const innerRadius = 300;
const outerRadius = 1000;


// JSON object to count occurances for each year

var svg = d3.select("#radialviz")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

g = svg.append("g").attr("transform", "translate(" + (width/2.5) + "," + (height-20) + ")");


// An angular x-scale
const x = d3.scaleBand()
  .range([-0.5*Math.PI, 0.5*Math.PI])
  .align(0);

// A radial y-scale maintains area proportionality of radial bars
const y = d3.scaleRadial()
  .range([innerRadius, outerRadius]);

const z = d3.scaleOrdinal()
  .range(["#e377c2", // Pink 
    "#1f77b4", // Blue
    "#ff7f0e", // Orange
    "#2ca02c", // Green
    "#9467bd", // Purple
    "#8c564b", // Brown
    "#66c2a5", // Light Green
    "#bcbd22", // Olive
    "#17becf", // Teal
    "#1a9850", // Dark Green
    "#7f7f7f", // Gray
    "#fc8d62", // Coral
    "#8da0cb", // Light Blue
    "#a6d854", // Yellow Green
    "#d62728",  // Red
    "#d3d3d3" // light Gray
  ]);

d3.csv('data/NGA_top15donor.csv').then(function (data) {

  var subgroups = data.columns.slice(1)
  console.log(subgroups)

  x.domain(data.map(function (d) { return d.TwonHalfDecade; }));
  y.domain([0, 25000]);
  z.domain(subgroups);

  g.append('g')
    .selectAll('g')
    .data(d3.stack().keys(data.columns.slice(1))(data))
    .enter()
    // .attr('class', function (d) { return d.key})
    .append('g')
    .attr('fill', function (d) {
      return z(d.key);
    })

    //我發現問題在你的g＿path沒有append class，所以他抓不到哪一個要調整透明度
    // .attr("class", function (d) { return getAttribute('data-chart-id');})
    //亂試出來的效果，讓chart能有一些互動
    .attr("class", function (d) { return 'button';})
    .selectAll('path')
    .data(function (d) {
      return d;
    })
    .enter()
    .append('path')
    .attr(
      'd',
      d3
        .arc()
        .innerRadius(function (d) {
          return y(d[0]);
        })
        .outerRadius(function (d) {
          return y(d[1]);
        })
        .startAngle(function (d) {
          return x(d.data.TwonHalfDecade);
        })
        .endAngle(function (d) {
          return x(d.data.TwonHalfDecade) + x.bandwidth();
        })
        .padAngle(0.01)
        .padRadius(innerRadius)
    );

  console.log(data.columns)

  //Label

  var label = g.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("text-anchor", "middle")
    .attr("font-size", 13)
    .attr("fill", "#595959")
    .attr("transform", function (d) {
      return "rotate(" + ((x(d.TwonHalfDecade) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)";
    });


  // label.append("line")
  //   .attr("x2", -5)
  //   .attr("stroke", "#000");

  label.append("text")
    .attr("transform", function (d) { return (x(d.TwonHalfDecade) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,16)" : "rotate(-90)translate(0,-9)"; })
    .text(function (d) { return d.TwonHalfDecade; });

  var yAxis = g.append("g")
    .attr("text-anchor", "middle");


  var yTick = yAxis
    .selectAll("g")
    .data(y.ticks(5).slice(1))
    .enter().append("g");


  yTick.append("circle")
    .attr("fill", "none")
    .attr("stroke", "#d3d3d3")
    .attr("stroke-dasharray", "6,3")
    .attr("r", y);

  yTick.append("text")
    .attr("y", function (d) { return -y(d); })
    .attr("dy", "-.5em")
    .text(y.tickFormat(5, "s"))
    .attr("font-size", 14)
    .attr("fill", "#a7a7a7");


  yAxis.append("text")
    .attr("y", function (d) { return -y(y.ticks(5).pop()); })
    .attr("dy", "-3em")
    .text("Amount of Artworks in Each 25 years");

});


const btns = document.querySelector('.btns');
const charts = document.querySelectorAll('#radialviz.subgroups');

btns.addEventListener('mouseover', (event) => {
  const target = event.target.getAttribute('data-chart-id');
  svg.selectAll(`.${target} path`).style('opacity', 1);
  svg.selectAll(`path`).style('opacity', 0.2);
});

btns.addEventListener('mouseout', (event) => {
  const target = event.target.getAttribute('data-chart-id');
  svg.selectAll(`path`).style('opacity', 1);
});


// const btns = document.querySelector('.btns');

// btns.addEventListener("mouseover", (event) => {
//   const target = event.target.getAttribute("data-chart-id");
//   // Log the target for debugging
//   console.log("Mouseover target:", target);

//   // Dim all paths within groups
//   svg.selectAll("g > path")
//     .attr("opacity", 0.2);

//   // Highlight paths within the target group
//   svg.selectAll(`.${target} > path`)
//     .attr("opacity", 1);
// });

// btns.addEventListener('mouseout', (event) => {
//   const target = event.target.getAttribute('data-chart-id');
//   // Log the target for debugging
//   console.log("Mouseout target:", target);

//   // Reset opacity for all paths within groups
//   svg.selectAll("g > path")
//     .attr("opacity", 1);
// });