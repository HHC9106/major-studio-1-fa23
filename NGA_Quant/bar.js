const barviz = document.querySelector("#barviz")

// define dimensions and margins for the graphic
const widthbar = barviz.offsetWidth;
const heightbar = barviz.offsetHeight;

var svg = d3.select("#barviz")
  .append("svg")
  .attr("width", widthbar)
  .attr("height", heightbar)
  .append("g")


// Parse the Data
d3.csv("data/sumof_NGA_top15donor.csv").then(function (data) {
  // console.log(data)

  // Add Y axis
  var yScale = d3.scaleLinear()
    .domain([0, 50000])
    .range([heightbar,margin.top]);

  svg.append("g")
    .call(d3.axisLeft(yScale).ticks(5))
    .attr("transform", `translate(120, -80)`)

    

  // color
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

  function barChartGenerator(year) {
    svg.selectAll("rect").select("*").remove()

    var filterValue = year;
    var filteredData = data.filter(function (d) {
      return d.century === filterValue;
    })[0]

    const keys = Object.keys(filteredData).filter(k => k !== "century")

    const newData = keys.reduce((newData, k, i) => {
      newData.push({
        "donor": k,
        "counts": +filteredData[k]
      })
      return newData
    }, [])

    console.log(newData)
    // X axis
    var xScale = d3.scaleBand()
      .range([120, widthbar-200-margin.left])
      .domain(newData.map(function (d) { return d.donor; }))
      .padding(0.1);

    svg.append("g")
      .call(d3.axisBottom(xScale))
      .attr("transform", "translate(0," + (heightbar-80)+ ")")
      .selectAll("text")
      .attr("font-size", 9)
      .attr("fill", "#595959")
      .attr("transform", "translate(-10,0)rotate(-30)")
      .style("text-anchor", "end");


    // Bars
    svg.append("g")
      .selectAll("rect")
      .data(newData)
      .join("rect")
      .attr("x", function (d) { return xScale(d.donor) })
      .attr("y", function (d) { return yScale(d.counts) })
      .attr("width", xScale.bandwidth())
      .attr("height", function (d) { return heightbar-yScale(d.counts); })
      .attr("transform", "translate(0," + (-80)+ ")")
      .attr("fill", function (d,i) { return z(i); })

  }

  barChartGenerator("sum")




})


