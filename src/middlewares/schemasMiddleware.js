import Joi from "joi";
import chalk from "chalk";

export async function transactionSchema(req, res, next) {
  const { description, type, value } = req.body;

  const schema = Joi.object({
    description: Joi.string().min(3).max(25).required(),
    type: Joi.string().valid("income", "outgoing").required(),
    value: Joi.string()
      .pattern(/^\d+\,\d{2}$/)
      .required(),
  });

  const { error } = schema.validate(
    { description, type, value },
    { abortEarly: false }
  );

  if (error) {
    console.log(chalk.bold.yellow(error));
    return res.status(422).send(error.details[0].message);
  }

  next();
}

export async function registerSchema(req, res, next) {
  const { name, email, password, repassword } = req.body;

  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(30).required(),
    repassword: Joi.string()
      .required()
      .valid(Joi.ref("password"))
      .label("Confirm password")
      .messages({ "any.only": "{{#label}} does not match" }),
  });

  const { error } = schema.validate(
    { name, email, password, repassword },
    { abortEarly: false }
  );

  if (error) {
    console.log(chalk.yellow.bold(error));
    res.status(422).send(error.details[0].message);
    return;
  }

  next();
}

export async function loginSchema(req, res, next) {
  const { email, password } = req.body;

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(30).required(),
  });

  const { error } = schema.validate({ email, password }, { abortEarly: false });

  if (error) {
    console.log(chalk.bold.yellow(error));
    return res.status(422).send(error.details[0].message);
  }

  next();
}
