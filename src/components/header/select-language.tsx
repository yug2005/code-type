import React, { useState } from "react";
import "../../css/header/select-language.css";

interface LanguagesPanelInterface {
  onLanguageClick(language: string): void;
}

const languages = [
  "c",
  "c++",
  "c#",
  "java",
  "javascript",
  "typescript",
  "python",
  "go",
  "rust",
  "swift",
];

const recentLanguages = [
  "c++",
  "javascript",
  "java",
  "typescript",
  "python",
  "c#",
];

const SelectLanguage = (props: LanguagesPanelInterface) => {
  const [searchText, setSearchText] = useState<string>("");

  // gets the languages filtered by the search text
  const getFilteredLanguagesList = () => {
    if (searchText.length === 0) {
      return languages.filter(
        (language: string) => !recentLanguages.includes(language)
      );
    } else if (searchText.length < 2) {
      return languages.filter((language: string) =>
        language.startsWith(searchText)
      );
    } else {
      return languages.filter((language: string) =>
        language.includes(searchText)
      );
    }
  };

  return (
    <div className="panel">
      <div className="languages-panel">
        <form
          className="form"
          onSubmit={() => props.onLanguageClick(getFilteredLanguagesList()[0])}
        >
          <input
            className="search-bar"
            type="text"
            placeholder="Search for language ..."
            onChange={(e) => setSearchText(e.target.value)}
          />
        </form>
        {searchText === "" && (
          <div className="search-suggestions">
            {recentLanguages.map((language) => (
              <button
                className="preferred-language-btn"
                onClick={() => props.onLanguageClick(language)}
              >
                <h3 className="button-text">{language}</h3>
              </button>
            ))}
          </div>
        )}
        {searchText === "" && (
          <div className="search-suggestions-bottom-bar"></div>
        )}
        <div className="languages-list">
          {getFilteredLanguagesList().map((language: string) => (
            <button
              key={language}
              onClick={() => props.onLanguageClick(language)}
              className={"listed-language"}
            >
              {language}
            </button>
          ))}
        </div>
      </div>
      <div
        className="close-panel"
        onClick={() => props.onLanguageClick("")}
      ></div>
    </div>
  );
};

export default SelectLanguage;
