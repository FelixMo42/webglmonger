import frag from "./frag.fs"
import vert from "./vert.vs"

import { createProgram } from "webglmonger/boilerplate"

createProgram(frag, vert)