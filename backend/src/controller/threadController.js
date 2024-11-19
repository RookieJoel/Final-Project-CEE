import thread from "../models/threadModel.js";

export const createItem = async (req, res) => {
  try {
    const newItem = new thread(req.body);
    await newItem.save();

    res.status(200).json({ message: "OK" });
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).json({ error: "Bad Request" });
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  }
};

export const getItems = async (req, res) => {
  const items = await thread.find();
  res.status(200).json(items);
};



export const deleteItem = async (req, res) => {
  // TODO2: implement this function
  // HINT: you can serve the internet and find what method to use for deleting item.
  try {
    const { id } = req.params;
    const deletedItem = await thread.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};


export const filterItems = async (req, res) => {
  // TODO3: implement this filter function
  // WARNING: you are not allowed to query all items and do something to filter it afterward.
  // Otherwise, you will be punished by -0.5 scores for this part
  try {
    const { filterThread } = req.query;

    // Construct the filter object based on the provided query parameters
    const filter = {};

    // If filterName is provided and not "-- ทั้งหมด --", add to filter; otherwise, skip it
    if (filterThread && filterThread !== "") {
      filter.name = filterThread;
    }

    // Add price range filters if provided
    console.log("Filter object:", filter); // Debugging line to verify filter content

    // Query MongoDB with the constructed filter
    const items = await thread.find(filter);
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};