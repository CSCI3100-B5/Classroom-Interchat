require('./report/report.js');

console.log('========================');
console.log('CODE STATISTICS');
console.log('========================');

console.log();
console.log('SUMMARY');
console.log();

console.log('Total Source Line Of Code (SLOC): ', __report.summary.total.sloc);
console.log('Total Maintainability: ', __report.summary.total.maintainability);

console.log();

console.log('Average Source Line Of Code (SLOC): ', __report.summary.average.sloc);
console.log('Average Maintainability: ', __report.summary.average.maintainability);

console.log();

console.log();
console.log('PER-FILE');
console.log();

__report.reports
  .filter(x => !/\.test\.jsx?$/.test(x.info.file))
  .forEach((report) => {
    console.log(report.info.file);
    console.log('    Maintainability                         : ', report.complexity.maintainability);
    console.log("    Cyclomatic Complexity (McCabe's number) : ", report.complexity.aggregate.complexity.cyclomatic);
    console.log('    Cyclomatic Complexity Density           : ', report.complexity.aggregate.complexity.cyclomaticDensity);
    console.log('    Logical Source Line Of Code (SLOC)      : ', report.complexity.aggregate.complexity.sloc.logical);
    console.log('    Halstead Complexity: ');
    console.log('        Delivered Bugs: ', report.complexity.aggregate.complexity.halstead.bugs);
    console.log('        Difficulty    : ', report.complexity.aggregate.complexity.halstead.difficulty);
    console.log('        Effort        : ', report.complexity.aggregate.complexity.halstead.effort);
    console.log('        Time required : ', report.complexity.aggregate.complexity.halstead.time);
    console.log('        Length        : ', report.complexity.aggregate.complexity.halstead.length);
    console.log('        Vocabulary    : ', report.complexity.aggregate.complexity.halstead.vocabulary);
    console.log('        Volume        : ', report.complexity.aggregate.complexity.halstead.volume);
    console.log();
  });
