# 11ty-recipes

Silly little proof of concept recipe blog.

## OVERVIEW

```sh
tree ./src

src
├── _data
│   └── recipes
│       ├── red-velvet-cupcakes.js
│       └── red-velvet-frosting.js
├── _includes
│   ├── recipe-list.njk
│   └── recipe.njk
├── _layouts
│   ├── default.njk
│   └── recipe.njk
└── recipes
    └── vegan-red-velvet-cupcakes.njk

5 directories, 7 files
```

Firstly, our recipes are posted in ./src/recipes/*.njk. Recipe pages, by themselves, are very basic.

```njk
---
title: Vegan Red Velvet Cupcakes
layout: recipe.njk
recipeList:
  - "red-velvet-cupcakes"
  - "red-velvet-frosting"
excerpt: Gloriously light and fluffy vegan red velvet cupcakes with red velvet frosting. Perfectly spongey and moist, vibrantly red, and fabulously vegan.
---

{# This will appear after the recipe. #}
<p>Have you ever seen such gorgeousness as these vegan red velvet cupcakes? ...</p>
...
```

We have the standard `title`, and `layout` properties in the front matter. But, we also have a `recipeList` (array of recipes to include), and an `excerpt` string. Finally, we have our rich text content which will appear after the recipe in the layout.

The magic here is the `recipeList` array, which maps to data files in the ./data/recipes/* folder. In this basic case, we're including both the ./src/_data/recipes/red-velvet-cupcakes.js and ./src/_data/recipes/red-velvet-frosting.js files into our layout.

Next, let's look at the ./src/_layouts/recipe.njk file:

```njk
---
layout: default.njk
---

<h1>{{ title | safe }}</h1>

<p class="lead">{{ excerpt | safe }}</p>

<section class="recipe-list">
{% include "recipe-list.njk" %}
</section>

<hr />

{{ content | safe }}
```

Here, we display the title, a formatted excerpt, we include the ./src/_includes/recipe-list.njk file, and then display any content from the calling template.

Next, let's look at the ./src/_includes/recipe-list.njk file:

```njk
{% for name in recipeList %}
  {% set recipe = recipes[name] %}
  {% include "recipe.njk" %}
{% endfor %}
```

This small but mighty snippet simply loops through the aray of `recipeList` data files, sets a `recipe` variable, and then includes the ./src/_includes/recipe.njk file, which is shown below (with some non-relevant markup omitted):

```njk
<header class="recipe__header">
  <h2 class="recipe__header--name">{{ recipe.name }}</h2>
</header>

<section class="recipe__ingredients">
  <h3>Ingredients</h3>
  <ul>
    {% for ingredient in recipe.ingredients %}
    <li><span class="ingredient-quantity">{{ ingredient.quantity | safe }}</span>
    {% if ingredient.href %}
      <a href="{{ ingredient.href | url }}">{{ ingredient.label | safe }}</a>
    {% else %}
      {{ ingredient.label | safe }}
    {% endif %}
    {% if ingredient.note %}
      <i>{{ ingredient.note | safe }}</i>
    {% endif %}
    </li>
    {% endfor %}
  </ul>
</section>

<section class="recipe__directions">
  <h3>Directions</h3>
  <ol>
    {% for step in recipe.directions %}
    <li>{{ step | safe }}</li>
    {% endfor %}
  </ol>
</section>
```

Nothing too special here, just a bit of markup to display the current sub-recipe in the page. We display the recipe name, then loop through the `recipe.ingredients` array and `recipe.directions` array. There probably isn't nearly enough defensive code for edge cases, but this is probably "good enough"<sup>(tm)</sup> for now.

One thing I like about this semi-convoluted approach is that the recipes are stored in data files in a JavaScript/JSON format, so they become relatively small and reusable building blocks. The code is somewhat distributed between different folders, but it allows you to reuse sub-recipes in multiple places throughout the site (if you want to use the same icing recipe for many different cupcakes/cakes).
