// vitest.config.ts
import { defineConfig } from "file:///D:/Codebox/__NPM__/DragKit/node_modules/vitest/dist/config.js";
var vitest_config_default = defineConfig({
  test: {
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      all: true,
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: [
        "src/**/*.test.ts",
        "src/**/*.test.tsx",
        "src/**/*.spec.ts",
        "src/**/*.spec.tsx",
        "src/**/index.ts",
        "src/types.ts"
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  }
});
export {
  vitest_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZXN0LmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXENvZGVib3hcXFxcX19OUE1fX1xcXFxEcmFnS2l0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxDb2RlYm94XFxcXF9fTlBNX19cXFxcRHJhZ0tpdFxcXFx2aXRlc3QuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Db2RlYm94L19fTlBNX18vRHJhZ0tpdC92aXRlc3QuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZXN0L2NvbmZpZydcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgdGVzdDoge1xuICAgIGluY2x1ZGU6IFsndGVzdHMvKiovKi50ZXN0LnRzJywgJ3Rlc3RzLyoqLyoudGVzdC50c3gnXSxcbiAgICBjb3ZlcmFnZToge1xuICAgICAgcHJvdmlkZXI6ICd2OCcsXG4gICAgICByZXBvcnRlcjogWyd0ZXh0JywgJ2pzb24nLCAnaHRtbCcsICdsY292J10sXG4gICAgICBhbGw6IHRydWUsXG4gICAgICBpbmNsdWRlOiBbJ3NyYy8qKi8qLnRzJywgJ3NyYy8qKi8qLnRzeCddLFxuICAgICAgZXhjbHVkZTogW1xuICAgICAgICAnc3JjLyoqLyoudGVzdC50cycsXG4gICAgICAgICdzcmMvKiovKi50ZXN0LnRzeCcsXG4gICAgICAgICdzcmMvKiovKi5zcGVjLnRzJyxcbiAgICAgICAgJ3NyYy8qKi8qLnNwZWMudHN4JyxcbiAgICAgICAgJ3NyYy8qKi9pbmRleC50cycsXG4gICAgICAgICdzcmMvdHlwZXMudHMnXG4gICAgICBdLFxuICAgICAgdGhyZXNob2xkczoge1xuICAgICAgICBsaW5lczogODAsXG4gICAgICAgIGZ1bmN0aW9uczogODAsXG4gICAgICAgIGJyYW5jaGVzOiA4MCxcbiAgICAgICAgc3RhdGVtZW50czogODBcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRRLFNBQVMsb0JBQW9CO0FBRXpTLElBQU8sd0JBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQU07QUFBQSxJQUNKLFNBQVMsQ0FBQyxzQkFBc0IscUJBQXFCO0FBQUEsSUFDckQsVUFBVTtBQUFBLE1BQ1IsVUFBVTtBQUFBLE1BQ1YsVUFBVSxDQUFDLFFBQVEsUUFBUSxRQUFRLE1BQU07QUFBQSxNQUN6QyxLQUFLO0FBQUEsTUFDTCxTQUFTLENBQUMsZUFBZSxjQUFjO0FBQUEsTUFDdkMsU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFlBQVk7QUFBQSxRQUNWLE9BQU87QUFBQSxRQUNQLFdBQVc7QUFBQSxRQUNYLFVBQVU7QUFBQSxRQUNWLFlBQVk7QUFBQSxNQUNkO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
