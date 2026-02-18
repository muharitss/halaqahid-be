import app from "./app";
import { PORT } from "./src/utils/env";

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
