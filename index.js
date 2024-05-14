const margin = { left: 120, right: 30, top: 60, bottom: 50 };

const width = document.querySelector("body").clientWidth,
      height = 500;

const svg = d3.select("svg").attr("viewBox", [0, 0, width, height]);

const x_scale = d3.scaleTime().range([margin.left, width - margin.right]);
const y_scale = d3.scaleLinear().range([height - margin.bottom, margin.top]);

const start_time = (d) => new Date(d.time);
const temperature = (d) => d.temperature_2m;

const line_generator = d3.line()
    .x((d) => x_scale(start_time(d)))
    .y((d) => y_scale(temperature(d)))
    .curve(d3.curveBasis);

const url = "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m&timezone=America%2FNew_York";

d3.json(url).then((data) => {
    const d = data.hourly.time.map((time, i) => ({
        time,
        temperature_2m: data.hourly.temperature_2m[i]
    }));

    console.log(d);

    x_scale.domain(d3.extent(d, start_time)).nice();
    y_scale.domain(d3.extent(d, temperature)).nice();

    // Append line path
    svg
        .append("path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 4)
        .attr("d", line_generator(d));

    // Create x and y axis
    const ticks = 10;
    const x_axis = d3.axisBottom(x_scale)
        .tickPadding(10)
        .ticks(ticks)
        .tickSize(-height + margin.top + margin.bottom);
    const y_axis = d3.axisLeft(y_scale)
        .tickPadding(5)
        .ticks(ticks)
        .tickSize(-width + margin.left + margin.right);

    // Append x axis
    svg
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(x_axis);

    // Append y axis
    svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(y_axis);
});


const x_label = "Time";
const y_label = "Temperature";
const location_name = "America/New York";


// Add title
svg
  .append("text")
  .attr("class", "svg_title")
  .attr("x", (width - margin.right + margin.left) / 2)
  .attr("y", margin.top / 2)
  .attr("text-anchor", "middle")
  .style("font-size", "22px")
  .text(`${y_label} in ${location_name}`);

// Add y label
svg
  .append("text")
  .attr("text-anchor", "middle")
  .attr(
    "transform",
    `translate(${margin.left - 70}, ${(height - margin.top - margin.bottom + 180) / 2}) rotate(-90)`
  )
  .style("font-size", "26px")
  .text(y_label);

// Add x label
svg
  .append("text")
  .attr("class", "svg_title")
  .attr("x", (width - margin.right + margin.left) / 2)
  .attr("y", height - margin.bottom + 50)
  .attr("text-anchor", "middle")
  .style("font-size", "26px")
  .text(x_label);



const ticks = 10;

const x_axis = d3.axisBottom(x_scale)
  .tickPadding(10)
  .ticks(ticks)
  .tickSize(-height + margin.top + margin.bottom);

const y_axis = d3.axisLeft(y_scale)
  .tickPadding(5)
  .ticks(ticks)
  .tickSize(-width + margin.left + margin.right)
  .tickFormat(d => d + "%");
