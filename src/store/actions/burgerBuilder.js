import * as actionTypes from "./actionTypes";
import axios from "../../axios-orders";

export const addIngredient = ingredientName => {
  return { type: actionTypes.ADD_INGREDIENT, ingredientName };
};

export const removeIngredient = ingredientName => {
  return {
    type: actionTypes.REMOVE_INGREDIENT,
    ingredientName
  };
};

export const setIngredients = ingredients => {
  return {
    type: actionTypes.SET_INGREDIENTS,
    ingredients
  };
};

export const initIngredients = () => {
  return dispatch => {
    axios
      .get("/ingredients.json")
      .then(response => {
        dispatch(setIngredients(response.data));
      })
      .catch(e => {
        dispatch(fetchIngredientsFail());
      });
  };
};

export const fetchIngredientsFail = () => {
  return { type: actionTypes.FETCH_INGREDIENTS_FAIL };
};