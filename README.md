# Module 1 Group Assignment

CSCI 5117, Spring 2023, [assignment description](https://canvas.umn.edu/courses/355584/pages/project-1)

## App Info:

* Team Name: MaryJ
* App Name: GoodSits.™
* App Link: (https://goodsits.onrender.com/)

### Students

* Andrew Hoyle, hoyle020@umn.edu
* Jack Lee, lee02802@umn.edu
* Minnerva Zou, zou00086@umn.edu
* Ryan Johnsen, joh18447@umn.edu
* Youssef Zahar, zahar022@umn.edu


## Key Features

**Describe the most challenging features you implemented
(one sentence per bullet, maximum 4 bullets):**

- We integrated the Google Maps API into our site to allow users to select real locations
- We used geospatial search methods, specifically Postgres SQL's Earthdistance module, to find study spot locations near our users
- Integrated novel SVG graphics into the background that will scale reactively to any device

## Testing Notes

**Is there anything special we need to know in order to effectively test your app? (optional):**

* ...


## Screenshots of Site

**[Add a screenshot of each key page (around 4)](https://stackoverflow.com/questions/10189356/how-to-add-screenshot-to-readmes-in-github-repository)
along with a very brief caption:**

![](https://media.giphy.com/media/o0vwzuFwCGAFO/giphy.gif)


## Mock-up

### Page 1 - Home

<img src="/low-fidelity-mockup/home.png" height=400px width=600px>

**Description:** Landing page when user first enters the url. Brief information about what the application does. 
The search bar takes a user to a dedicated search page. At the top, across all pages, will be a navigation bar to 
go to the different pages.
  
### Page 2 - Search

<img src="/low-fidelity-mockup/seacrch1.png" height=400px width=600px>
<img src="/low-fidelity-mockup/search02.png" height=400px width=600px>

**Description:** Where the user finds study spots near them. Entering a search in the search bar makes the red markers appear along with the cards on the left sidebar. Clicking any card on the left sidebar brings the user to Page 4 (Location). Clicking the Filters button on the left side opens the modal pictured in the bottom right (modal with tags / rating / availability / proximity).

### Page 3 - Add Location

<img src="/low-fidelity-mockup/location.png" height=400px width=600px>

**Description:** A page for entering a study spot. The user can enter a location and basic information about the spot. After you click "Add Location", 
the user will be redirected to the study spot's Location page.

### Page 4 - Location

<img src="/low-fidelity-mockup/location-1.png" height=400px width=600px>
<img src="/low-fidelity-mockup/location-2.png" height=400px width=600px>

**Description:** This is the page that users will see when they click on a study spot. 
It will contain information about the study spot including the ratings and reviews. 
The user can click Add Review and will be presented with a modal to enter information (second) image.

## External Dependencies

**Document integrations with 3rd Party code or services here.
Please do not document required libraries. or libraries that are mentioned in the product requirements**

* Google Maps API: used for converting latitude/longitude coordinates into tangible building addresses 
* python-magic: used for file type identification of the images in our database

**If there's anything else you would like to disclose about how your project
relied on external code, expertise, or anything else, please disclose that
here:**

...
