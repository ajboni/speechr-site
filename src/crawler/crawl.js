/**
 * Copyright (C) 2020 Alexis Boni
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const path = require("path");
const { config } = require("../../config");
const { writeFileSync } = require("fs-extra");
const { copyMedia } = require("./copy_media");
const { makeLandingPages } = require("./make_landing_pages");
const { logTitle } = require("../utils/log");
const { timeElpasedInSeconds } = require("../utils/date_utils");
const { makeStyles } = require("./make_styles");
const { initBuildFolder } = require("./init_build_folder");
const { makeTemplates } = require("./make_templates");
const { makeDocPages } = require("./make_docs_pages");
const { makeSidebars } = require("./make_sidebar");
const { cleanUp } = require("./clean_up");
const { makeSearch } = require("./make_search");
const { BUILD_FOLDER } = config;

async function crawl() {
  const startTime = new Date();

  /* Clean Up */
  initBuildFolder();

  /* Copy Media Files */
  copyMedia();

  /* Generate Styles */
  makeStyles();

  /* Generate basic templates */
  await makeTemplates();

  /* Process Landing Pages */
  makeLandingPages();

  /* Process Documents */
  await makeDocPages();

  /* Process Sidebar */
  makeSidebars();

  /* Generate Search Indexes */
  makeSearch();

  /* Clean UP */
  await cleanUp();

  /* Build Completed */
  const elapsed = timeElpasedInSeconds(startTime, new Date());
  logTitle(`Building Done in ${elapsed} seconds.`);
  writeFileSync(
    path.join(BUILD_FOLDER, ".build.log"),
    new Date().toISOString()
  );
}

module.exports.crawl = crawl;
