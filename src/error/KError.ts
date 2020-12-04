export default class KError extends Error{
  constructor(message, public code) {
    super(message);
  }
}
