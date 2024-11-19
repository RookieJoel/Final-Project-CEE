const threadSchema = {
  id: "number",
  title: "string",
  description: "string",
  likes: "number",
  dislikes: "number",
  comments: [
    {
      id: "number",
      user: "string",
      text: "string",
      likes: "number",
      dislikes: "number",
      threadId: "number",
    },
  ],
};

class Thread {
  /**
   * @param {number} id - The unique ID for the thread.
   * @param {string} title - The title of the thread.
   * @param {string} description - A description of the thread.
   * @param {number} likes - The number of likes for the thread.
   * @param {number} dislikes - The number of dislikes for the thread.
   */
  constructor(id, title, description, likes = 0, dislikes = 0) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.likes = likes;
    this.dislikes = dislikes;
    this._id = Math.floor(Math.random() * 100000); // Generate a unique ID
    this.comments = []; // Initialize an empty comments array
  }

  /**
   * Adds a comment to the thread.
   * @param {string} user - The name of the user adding the comment.
   * @param {string} text - The content of the comment.
   */
  addComment(user, text) {
    const comment = {
      id: this.comments.length + 1, // Incremental ID for comments
      user: user,
      text: text,
      likes: 0,
      dislikes: 0,
      threadId: this.id,
    };
    this.comments.push(comment);
  }
}

/**
 * Creates a new Thread object from an input object after validation.
 * @param {object} obj - The input object to convert into a Thread instance.
 * @returns {Thread} - A new Thread instance.
 * @throws {Error} - Throws an error if validation fails.
 */
function threadFromObject(obj) {
  const errors = [];
  for (const field in threadSchema) {
    if (!(field in obj)) {
      errors.push(`Expected key '${field}'`);
    } else {
      if (threadSchema[field] === "number") {
        // Validate numeric fields
        try {
          obj[field] = parseFloat(obj[field]);
          if (isNaN(obj[field])) {
            throw new Error();
          }
        } catch {
          errors.push(
            `Expected value of '${field}' to be a number, found ${typeof obj[field]}`
          );
        }
      } else if (typeof obj[field] !== threadSchema[field]) {
        errors.push(
          `Expected value of '${field}' to be ${threadSchema[field]}, found ${typeof obj[field]}`
        );
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }

  // Create and return a new Thread instance
  return new Thread(
    obj.id,
    obj.title,
    obj.description,
    obj.likes,
    obj.dislikes
  );
}

export { Thread, threadFromObject };