(function ($) {
    'use strict';
    Drupal.behaviors.dbtests_src = {
      attach: function(context, settings) {
            // This just ensures this JS is called once to avoid Drupal ajax recalls
            $(context).find(".block-dbtests").once("dbtests_src").each(function () {
                
                var svg = d3.select("#dbtests svg"),
                    spanTotal= d3.select("#dbtests h2 span.total"),
                    spanUpdated= d3.select("#dbtests h2 span.updated"),
                    margin = {top: 20, right: 20, bottom: 30, left: 80},
                    width = parseInt(d3.select('#dbtests').style('width')),
                    height = parseInt(d3.select('#dbtests').style('height')),
                    axisMargin = 20,
                    valueMargin = 4,
                    bar, toolTip, scale, xAxis, labelWidth = 0;

                d3.json("/rest/dashboard-tests")
                //d3.json("/d8-chart-test-2/web/rest/dashboard-tests")
                    .then (function(data) {
                        var total = d3.max(data, function(d) { return d.TotalTests; }),
                            barHeight = (height-axisMargin-margin.bottom-margin.top)* 0.4/data.length,
                            barPadding = (height-axisMargin)*0.6/data.length;
                        
                        svg
                            .attr("viewBox", "0 0 " + width + " " + (height) )
                            .attr("preserveAspectRatio", "xMidYMid meet")
                            .append("title")
                            .text("Respitory Tests");

                        svg
                            .data(data)
                            .append("description")
                            .text(function(d){
                                return "Horizontal bar chart measuring the number of Respitory Tests. Last updated " + d.Updated + ".";
                            });
                            


                        bar = svg.selectAll("g")
                            .data(data)
                            .enter()
                            .append("g");

                        bar.attr("class", "bar")
                            .attr("cx",0)
                            .attr("transform", function(d, i) {
                                return "translate(40," + (i * (barHeight + barPadding) + barPadding) + ")";
                            });
                
                        bar.append("text")
                            .attr("class", "label")
                            .attr("y", barHeight / 2)
                            .attr("dy", ".35em") //vertical align middle
                            .text(function(d){
                                return d.DisplayText;
                            }).each(function() {
                                labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
                            });
                    
                        scale = d3.scaleLinear()
                            .domain([0, total])
                            .range([0, width - labelWidth]);
                    
                        bar.append("rect")
                            .attr("transform", "translate("+labelWidth+", 0)")
                            .attr("height", barHeight)
                            .attr("width", function(d){return scale(d.NumTests);});
                    
                        bar.append("text")
                            .attr("class", "value")
                            .attr("y", barHeight / 2)
                            .attr("dx", -valueMargin + labelWidth + 40) //margin right
                            .attr("dy", ".35em") //vertical align middle
                            .attr("text-anchor", "end")
                            .attr("x", function(d){return scale(d.NumTests); })
                            .text(function(d){ return (d.DisplayPct); });
                            
                        toolTip = bar.append("g")
                                    .attr("class", "testToolTip")
                                    .style("display", "none");
                        
                        toolTip.append("rect")
                                .style("stroke-width", 1)
                                .style("stroke", "gray")
                                .style("fill", "gray")
                                .style("width", 300)
                                .style("height", 30)
                                .style("fill", "#bbb");
                                
                        toolTip.append("text")
                                .attr("class", "ttText")
                                .html(function(d){ 
                                    var num = d.NumTests;
                                    return d.DisplayText + " | " + num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                                } )
                                .style("fill", "black")
                                .attr("x", "30px")
                                .attr("y", "20px"); 
                                    
                         bar
                            .on("mouseover", function(d){
                                d3.select(this).select(".testToolTip")
                                    .style("display", "inline-block")
                                    .attr("transform", "translate("+ (-valueMargin + labelWidth + scale(d.NumTests) + 90) +", 0)");
                            });
                        bar
                            .on("mouseout", function(d){
                                d3.select(this).select(".testToolTip").style("display", "none");
                            });
                            
                    
                        xAxis = d3.axisBottom(scale).ticks(5).tickSizeInner([-height]);
                       
                        svg.insert("g",":nth-child(3)")
                            .attr("class", "axisHorizontal")
                            .attr("transform", "translate(" + (40 + labelWidth) + ","+ (height - axisMargin )+")")
                            .call(xAxis);
                        
                        spanTotal
                            .data(data)
                            .text(function(d){
                                var num = d.TotalTests;
                                return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                            });

                        spanUpdated
                            .data(data)
                            .text(function(d){
                                return ("(Last Updated: " + d.Updated + ")");
                            });
                })
                .catch (function(error){
                    console.log(error);
                })
            })
        }
    };
}(jQuery));