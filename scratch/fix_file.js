const fs = require("fs");
const path = require("path");

const filePath = path.join(process.cwd(), "src/components/admin/RitualGuideForm.tsx");
let content = fs.readFileSync(filePath, "utf8");

// Replacement 1: Merge additional & ashtaminavami tabs
const target1 = `            </div>
          </div>
        )}

        {/* --- Tab: Ashtami & Navami --- */}
        {activeTab === "ashtaminavami" && (
          <div className="space-y-6">`;

const replacement1 = `            </div>
          </div>

          {/* --- Tab: Ashtami & Navami --- */}
          <div className="space-y-6 border-t border-[#F2ECE4] pt-8">`;

// Replacement 2: Close Deep-dive section
const target2 = `              </div>
            </div>
          </div>

          {/* Related Content & Overrides */}`;

const replacement2 = `              </div>
            </div>
          </div>
          </div>

          {/* Related Content & Overrides */}`;

// Replacement 3: Close Related content section
const target3 = `                </div>
              </div>

              {/* Companion Product Overrides (Shakti Kit, Purohit booking, Tapa Circle) */}`;

const replacement3 = `                </div>
              </div>
              </div>

              {/* Companion Product Overrides (Shakti Kit, Purohit booking, Tapa Circle) */}`;

// Replacement 4: Close Ashtami/Navami section & additional tab wrapper
const target4 = `              </div>
            </div>
          </div>
        )}

        {/* --- Tab: DPB Claims Wizard --- */}`;

const replacement4 = `              </div>
            </div>
          </div>
          </div>
          </div>
        )}

        {/* --- Tab: DPB Claims Wizard --- */}`;

if (content.includes(target1)) {
  content = content.replace(target1, replacement1);
  console.log("✓ Applied replacement 1 (Merged tabs)");
} else {
  console.error("✗ Replacement 1 target not found!");
}

if (content.includes(target2)) {
  content = content.replace(target2, replacement2);
  console.log("✓ Applied replacement 2 (Closed Deep-dive)");
} else {
  console.error("✗ Replacement 2 target not found!");
}

if (content.includes(target3)) {
  content = content.replace(target3, replacement3);
  console.log("✓ Applied replacement 3 (Closed Related content)");
} else {
  console.error("✗ Replacement 3 target not found!");
}

if (content.includes(target4)) {
  content = content.replace(target4, replacement4);
  console.log("✓ Applied replacement 4 (Closed additional wrapper)");
} else {
  console.error("✗ Replacement 4 target not found!");
}

fs.writeFileSync(filePath, content);
console.log("File saved.");
