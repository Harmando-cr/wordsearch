# wordsearch

Wordsearch is a javascript project that finds more than one sequence of four letters
equal, obliquely, horizontally or vertically in a matrix

## Installation

Use npm to install all the requirements on the root directory

```bash
npm install 
```

## Usage

For local enviroments use node.

```bash
node index.js
```
This will run on port 3000.

The project has two endopoints

First we have the service "/mutant/" where it is possible to detect if a matrix 
has more than one sequence of four letter, via HTTP POST with a Json which has the
next format:

```
POST → /mutant/
{
"dna":["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"]
}
```

In case you have more than one sequence, it should return an HTTP 200-OK (True), otherwise a
403-Forbidden (False)

The second is the GET service "/stats" that returns a Json with the statistics of the verifications of the matrices: {"count_mutant_dna":40, "count_human_dna":100, "ratio":0.4}.

"count_mutant_dna" for more than one sequence, "count_human_dna" for the other case.


This services also has been deployed in a firebase serve, so you can do your request to:
```
https://us-central1-xmen-f6db2.cloudfunctions.net/api/mutant

https://us-central1-xmen-f6db2.cloudfunctions.net/api/stats
```

To can save and get data on firestore we need the config enviroment and credetials to firebase. So, locally, you can request the '/mutant' POST service without persist the data. And you cannot request the '/stats' GET service.

Please use the link of service given above.

## Test

Some load tests were performed, however they were limited by the firebase quotas for the free plan.

```bash
All virtual users finished
Summary report @ 11:23:42(-0400) 2019-05-22
  Scenarios launched:  10
  Scenarios completed: 10
  Requests completed:  10
  RPS sent: 1.06
  Request latency:
    min: 242.8
    max: 512
    median: 250.5
    p95: 512
    p99: 512
  Scenario counts:
    0: 10 (100%)
  Codes:
    200: 10

All virtual users finished
Summary report @ 14:43:52(-0400) 2019-05-22
  Scenarios launched:  100
  Scenarios completed: 100
  Requests completed:  100
  RPS sent: 9.7
  Request latency:
    min: 237.8
    max: 7674.7
    median: 2242.6
    p95: 5893.2
    p99: 7618.4
  Scenario counts:
    0: 100 (100%)
  Codes:
    200: 77
    429: 23
```

After a quantity, the firebase server limit the request.

You can do this test typing

```bash
artillery run artillery.yml
```

#### Unit Test and Code Coverage
    To not change all the scheme of the index, the test was realized over the main function.
    the result was:

```bash
> xmendna@1.0.0 test /home/hcolmenares/Xmen
> jest --coverage

 PASS  ./index.test.js
  ✓ finding more than one sequence (11ms)
  ✓ finding less than one sequence (11ms)

  console.log index.js:48
    app running on port  3000

----------|----------|----------|----------|----------|-------------------|
File      |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
----------|----------|----------|----------|----------|-------------------|
All files |    97.03 |     88.1 |     87.5 |    96.55 |                   |
 index.js |    97.03 |     88.1 |     87.5 |    96.55 |          13,18,25 |
----------|----------|----------|----------|----------|-------------------|
Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        1.242s
Ran all test suites.
```  
you can run this test with:

```bash
npm run test 
```  
### Something Else

The directory "functions" was created by the deploy on firebase, there is a file named "index.js", this is the version that works in the firebase server.

The index.js file in the root directory, is a version to local unit test and code coverage, the differences between this files, are the calls to DB, and some commented code, that no has sense in local.

On the index file, you can find a function named 'generateDNA', this will create a random square matrix 
with the length of you provide it in the parameter. Was made to test the pricipal function with large matrices



