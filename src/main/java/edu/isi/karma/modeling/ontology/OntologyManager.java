/*******************************************************************************
 * Copyright 2012 University of Southern California
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * 	http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * This code was developed by the Information Integration Group as part 
 * of the Karma project at the Information Sciences Institute of the 
 * University of Southern California.  For more information, publications, 
 * and related projects, please see: http://www.isi.edu/integration
 ******************************************************************************/
package edu.isi.karma.modeling.ontology;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import edu.isi.karma.rep.alignment.Label;

public class OntologyManager {
	
	static Logger logger = Logger.getLogger(OntologyManager.class.getName());

	private OntologyHandler ontHandler = null;
	private OntologyCache ontCache = null;
	private List<OntologyUpdateListener> ontUpdateListeners; 
	
	public OntologyManager() {
		ontHandler = new OntologyHandler();
		ontCache = new OntologyCache(ontHandler);
		ontUpdateListeners = new ArrayList<OntologyUpdateListener>();	
	}

	public boolean isEmpty() {
		return ontHandler.getOntModel().isEmpty();
	}
	
	public boolean isClass(String uri) {

		return this.ontCache.getClasses().containsKey(uri);
	}

	public boolean isProperty(String uri) {

		return this.ontCache.getProperties().containsKey(uri);
	}

	public boolean isDataProperty(String uri) {

		return this.ontCache.getDataProperties().containsKey(uri);
	}

	public boolean isObjectProperty(String uri) {

		return this.ontCache.getObjectProperties().containsKey(uri);
	}
	
	private void notifyListeners() {
		for (OntologyUpdateListener o : ontUpdateListeners)
			o.ontologyModelUpdated();
	}
	
	public boolean doImportAndUpdateCache(File sourceFile) {

		if (sourceFile == null) {
			logger.debug("input file is null.");
			return false;
		}
		
		logger.debug("Importing " + sourceFile.getName() + " OWL Ontology ...");

		if(!sourceFile.exists()){
			logger.error("file does not exist  " + sourceFile.getAbsolutePath());
			return false;
		}
		
		try {
			InputStream s = new FileInputStream(sourceFile);
			ontHandler.getOntModel().read(s, null);
		} catch (Throwable t) {
			logger.error("Error reading the OWL ontology file!", t);
			return false;
		}
		
		// update the cache
		ontCache = new OntologyCache(ontHandler);
		ontCache.init();
		
		// notify listeners
		this.notifyListeners();
		
		logger.debug("done.");
		return true;
	}
	
	public boolean doImport(File sourceFile) {

		if (sourceFile == null) {
			logger.debug("input file is null.");
			return false;
		}
		
		logger.debug("Importing " + sourceFile.getName() + " OWL Ontology ...");

		if(!sourceFile.exists()){
			logger.error("file does not exist  " + sourceFile.getAbsolutePath());
			return false;
		}
		
		try {
			InputStream s = new FileInputStream(sourceFile);
			ontHandler.getOntModel().read(s, null);
		} catch (Throwable t) {
			logger.error("Error reading the OWL ontology file!", t);
			return false;
		}
		
		// notify listeners
		this.notifyListeners();

		logger.debug("done.");
		return true;
	}
	
	public void updateCache() {
		ontCache = new OntologyCache(ontHandler);
		ontCache.init();
	}
	
	public HashMap<String, Label> getClasses() {
		return this.ontCache.getClasses();
	}

	public HashMap<String, Label> getProperties() {
		return this.ontCache.getProperties();
	}

	public HashMap<String, Label> getDataProperties() {
		return this.ontCache.getDataProperties();
	}

	public HashMap<String, Label> getObjectProperties() {
		return this.ontCache.getObjectProperties();
	}

	public HashMap<String, Label> getDataPropertiesWithoutDomain() {
		return this.ontCache.getDataPropertiesWithoutDomain();
	}

	public HashMap<String, Label> getObjectPropertiesWithOnlyDomain() {
		return this.ontCache.getObjectPropertiesWithOnlyDomain();
	}

	public HashMap<String, Label> getObjectPropertiesWithOnlyRange() {
		return this.ontCache.getObjectPropertiesWithOnlyRange();
	}

	public HashMap<String, Label> getObjectPropertiesWithoutDomainAndRange() {
		return this.ontCache.getObjectPropertiesWithoutDomainAndRange();
	}
	
	public OntologyTreeNode getClassHierarchy() {
		return this.ontCache.getClassHierarchy();
	}

	public OntologyTreeNode getObjectPropertyHierarchy() {
		return this.ontCache.getObjectPropertyHierarchy();
	}

	public OntologyTreeNode getDataPropertyHierarchy() {
		return this.ontCache.getDataPropertyHierarchy();
	}

//	public HashMap<String, List<String>> getDomainRangeToDirectProperties() {
//		return this.ontCache.getDomainRangeToDirectProperties();
//	}
//
//	public HashMap<String, List<String>> getDomainRangeToIndirectProperties() {
//		return this.ontCache.getDomainRangeToIndirectProperties();
//	}
//
//	public HashMap<String, List<String>> getDomainRangeToDomainlessProperties() {
//		return this.ontCache.getDomainRangeToDomainlessProperties();
//	}
//
//	public HashMap<String, List<String>> getDomainRangeToRangelessProperties() {
//		return this.ontCache.getDomainRangeToRangelessProperties();
//	}
//
//	public HashMap<String, List<DomainRangePair>> getDomainRangePairsOfDirectProperties() {
//		return this.ontCache.getDomainRangePairsOfDirectProperties();
//	}
//
//	public HashMap<String, List<DomainRangePair>> getDomainRangePairsOfIndirectProperties() {
//		return this.ontCache.getDomainRangePairsOfIndirectProperties();
//	}
//
//	public HashMap<String, List<DomainRangePair>> getDomainRangePairsOfDomainlessProperties() {
//		return this.ontCache.getDomainRangePairsOfDomainlessProperties();
//	}
//
//	public HashMap<String, List<DomainRangePair>> getDomainRangePairsOfRangelessProperties() {
//		return this.ontCache.getDomainRangePairsOfRangelessProperties();
//	}
//
//	public HashMap<String, Boolean> getConnectedByDirectProperties() {
//		return this.ontCache.getConnectedByDirectProperties();
//	}
//
//	public HashMap<String, Boolean> getConnectedByIndirectProperties() {
//		return this.ontCache.getConnectedByIndirectProperties();
//	}
//
//	public HashMap<String, Boolean> getConnectedByDomainlessProperties() {
//		return this.ontCache.getConnectedByDomainlessProperties();
//	}
//
//	public HashMap<String, Boolean> getConnectedByRangelessProperties() {
//		return this.ontCache.getConnectedByRangelessProperties();
//	}
	
	public Label getUriLabel(String uri) {
		return this.ontCache.getUriLabel(uri);
	}
	
	/**
	 * Returns the inverse property of the property with given URI
	 * @param uri
	 * @return
	 */
	public Label getInverseProperty(String uri) {
		return this.ontCache.getPropertyInverse().get(uri);
	}
	
	/**
	 * Returns the inverseOf property of the property with given URI
	 * @param uri
	 * @return
	 */
	public Label getInverseOfProperty(String uri) {
		return this.ontCache.getPropertyInverseOf().get(uri);		
	}
	
	/**
	 * If @param superClassUri is a superclass of @param subClassUri, it returns true; otherwise, false.
	 * If third parameter is set to true, it also considers indirect superclasses.
	 * @param superClassUri
	 * @param subClassUri
	 * @param recursive
	 * @return
	 */
	public boolean isSubClass(String subClassUri, String superClassUri, boolean recursive) {
		
		if (ontCache.getDirectSubClassCheck().containsKey(subClassUri + superClassUri))
			return true;
		else if (recursive) 
			return ontCache.getIndirectSubClassCheck().containsKey(subClassUri + superClassUri);
		
		return false;
	}
	
	/**
	 * If @param subPropertyUri is a subProperty of @param superPropertyUri, it returns true; otherwise, false.
	 * If third parameter is set to true, it also considers indirect subproperties.
	 * @param subPropertyUri
	 * @param superClassUri
	 * @param recursive
	 * @return
	 */
	public boolean isSubProperty(String subPropertyUri, String superPropertyUri, boolean recursive) {
		
		if (ontCache.getDirectSubPropertyCheck().containsKey(subPropertyUri + superPropertyUri))
			return true;
		else if (recursive) 
			return ontCache.getIndirectSubPropertyCheck().containsKey(subPropertyUri + superPropertyUri);
		
		return false;
	}
		
	
	/**
	 * This method takes a property URI and returns domains of that property.
	 * If @param recursive is true, it also returns the children of the domains.
	 * @param propertyUri
	 * @param recursive
	 * @return
	 */
	public List<String> getDomainsOfProperty(String propertyUri, boolean recursive) {

		List<String> results = new ArrayList<String>();
		List<String> direct = null;
		List<String> indirect = null;
		
		direct = ontCache.getPropertyDirectDomains().get(propertyUri);
		if (direct != null) results.addAll(direct);
		if (recursive) indirect = ontCache.getPropertyIndirectDomains().get(propertyUri);
		if (indirect != null) results.addAll(indirect);
		
		return results;

	}

	/**
	 * This method takes a property URI and returns ranges of that property.
	 * If @param recursive is true, it also returns the children of the domains.
	 * @param propertyUri
	 * @param recursive
	 * @return
	 */
	public List<String> getRangesOfProperty(String propertyUri, boolean recursive) {

		List<String> results = new ArrayList<String>();
		List<String> direct = null;
		List<String> indirect = null;
		
		direct = ontCache.getPropertyDirectRanges().get(propertyUri);		
		if (direct != null) results.addAll(direct);
		if (recursive) indirect = ontCache.getPropertyIndirectRanges().get(propertyUri);
		if (indirect != null) results.addAll(indirect);
		
		return results;

	}
	
	/**
	 * This method takes @param rangeClassUri and for object properties whose ranges includes this parameter, 
	 * returns all of their domains.
	 * If @param recursive is true, it also returns the children of the domains.
	 * @param rangeUri
	 * @param recursive
	 * @return
	 */
	public List<String> getDomainsGivenRange(String rangeUri, boolean recursive) {
		
		List<String> objectProperties = ontCache.getDirectInObjectProperties().get(rangeUri);
		List<String> results = new ArrayList<String>();
		List<String> direct = null;
		List<String> indirect = null;
		
		if (objectProperties == null)
			return results;
		
		for (String op : objectProperties) {
			direct = ontCache.getPropertyDirectDomains().get(op);
			if (direct != null) results.addAll(direct);
			if (recursive) indirect = ontCache.getPropertyIndirectDomains().get(op);
			if (indirect != null) results.addAll(indirect);
		}
		
		return results;
	}
	
	public Map<String, String> getPrefixMap () {
		Map<String, String> nsMap = ontHandler.getOntModel().getNsPrefixMap();
		Map<String, String> prefixMap = new HashMap<String, String>();
		
		for(String ns: nsMap.keySet()) {
			if (!ns.equals("") && !prefixMap.containsKey(nsMap.get(ns)))
				prefixMap.put(nsMap.get(ns), ns);
		}
		return prefixMap;
	}
	
	/**
	 * returns URIs of all subclasses of @param classUri (also considers indirect subclasses if second parameter is true).
	 * @param classUri
	 * @param recursive
	 * @return
	 */
	public HashMap<String, Label> getSubClasses(String classUri, boolean recursive) {
		
		HashMap<String, Label> direct = ontCache.getDirectSubClasses().get(classUri);
		if (!recursive) return direct;
		
		HashMap<String, Label> all = new HashMap<String, Label>();
		HashMap<String, Label> indirect = ontCache.getIndirectSubClasses().get(classUri);
		if (direct != null) all.putAll(direct);
		if (indirect != null) all.putAll(indirect);
		return all;
	}
	
	/**
	 * returns URIs of all superclasses of @param classUri (also considers indirect superclasses if second parameter is true).
	 * @param classUri
	 * @param recursive
	 * @return
	 */
	public HashMap<String, Label> getSuperClasses(String classUri, boolean recursive) {
		
		HashMap<String, Label> direct = ontCache.getDirectSuperClasses().get(classUri);
		if (!recursive) return direct;
		
		HashMap<String, Label> all = new HashMap<String, Label>();
		HashMap<String, Label> indirect = ontCache.getIndirectSuperClasses().get(classUri);
		if (direct != null) all.putAll(direct);
		if (indirect != null) all.putAll(indirect);
		return all;
	}
	
	/**
	 * returns URIs of all sub-properties of @param propertyUri
	 * @param propertyUri
	 * @param recursive
	 * @return
	 */
	public HashMap<String, Label> getSubProperties(String propertyUri, boolean recursive) {

		HashMap<String, Label> direct = ontCache.getDirectSubProperties().get(propertyUri);
		if (!recursive) return direct;
		
		HashMap<String, Label> all = new HashMap<String, Label>();
		HashMap<String, Label> indirect = ontCache.getIndirectSubProperties().get(propertyUri);
		if (direct != null) all.putAll(direct);
		if (indirect != null) all.putAll(indirect);
		return all;

	}
	
	/**
	 * returns URIs of all super-properties of @param propertyUri
	 * @param propertyUri
	 * @param recursive
	 * @return
	 */
	public HashMap<String, Label> getSuperProperties(String propertyUri, boolean recursive) {

		HashMap<String, Label> direct = ontCache.getDirectSuperProperties().get(propertyUri);
		if (!recursive) return direct;
		
		HashMap<String, Label> all = new HashMap<String, Label>();
		HashMap<String, Label> indirect = ontCache.getIndirectSuperProperties().get(propertyUri);
		if (direct != null) all.putAll(direct);
		if (indirect != null) all.putAll(indirect);
		return all;

	}

	/**
	 * This function takes a class uri and returns the datatype properties who have this class in their domain. 
	 * If second parameter set to True, it also returns the datatype properties inherited from parents of the given class.
	 * @param domainUri
	 * @param inheritance
	 * @return
	 */
	public List<String> getDataPropertiesOfClass(String domainUri, boolean inheritance) {

		List<String> direct = ontCache.getDirectOutDataProperties().get(domainUri);
		if (!inheritance) return direct;
		
		List<String> all = new ArrayList<String>();
		List<String> indirect = ontCache.getIndirectOutDataProperties().get(domainUri);
		if (direct != null) all.addAll(direct);
		if (indirect != null) all.addAll(indirect);
		return all;

	}

	/**
	 * This function takes a class uri and returns the object properties who have this class in their domain. 
	 * If second parameter set to True, it also returns the object properties inherited from parents of the given class.
	 * @param domainUri
	 * @param inheritance
	 * @return
	 */
	public List<String> getObjectPropertiesOfClass(String domainUri, boolean inheritance) {

		List<String> direct = ontCache.getDirectOutObjectProperties().get(domainUri);
		if (!inheritance) return direct;
		
		List<String> all = new ArrayList<String>();
		List<String> indirect = ontCache.getIndirectOutObjectProperties().get(domainUri);
		if (direct != null) all.addAll(direct);
		if (indirect != null) all.addAll(indirect);
		return all;
	}
	
	public List<String> getObjectPropertiesDirect(String domainUri, String rangeUri) {
		if (domainUri == null || rangeUri == null) return null;
		return this.ontCache.getDomainRangeToDirectProperties().get(domainUri + rangeUri);
	}

	public List<String> getObjectPropertiesIndirect(String domainUri, String rangeUri) {
		if (domainUri == null || rangeUri == null) return null;
		return this.ontCache.getDomainRangeToIndirectProperties().get(domainUri + rangeUri);
	}

	public List<String> getObjectPropertiesWithOnlyDomain(String domainUri, String rangeUri) {
		if (domainUri == null || rangeUri == null) return null;
		return this.ontCache.getDomainRangeToRangelessProperties().get(domainUri + rangeUri);
	}

	public List<String> getObjectPropertiesWithOnlyRange(String domainUri, String rangeUri) {
		if (domainUri == null || rangeUri == null) return null;
		return this.ontCache.getDomainRangeToDomainlessProperties().get(domainUri + rangeUri);
	}

	public boolean isConnectedByDirectProperty(String domainUri, String rangeUri) {
		if (domainUri == null || rangeUri == null) return false;
		return this.ontCache.getConnectedByDirectProperties().containsKey(domainUri + rangeUri);
	}

	public boolean isConnectedByIndirectProperty(String domainUri, String rangeUri) {
		if (domainUri == null || rangeUri == null) return false;
		return this.ontCache.getConnectedByIndirectProperties().containsKey(domainUri + rangeUri);
	}

	public boolean isConnectedByDomainlessProperty(String domainUri, String rangeUri) {
		if (domainUri == null || rangeUri == null) return false;
		return this.ontCache.getConnectedByDomainlessProperties().containsKey(domainUri + rangeUri);
	}

	public boolean isConnectedByRangelessProperty(String domainUri, String rangeUri) {
		if (domainUri == null || rangeUri == null) return false;
		return this.ontCache.getConnectedByRangelessProperties().containsKey(domainUri + rangeUri);
	}
	
	public boolean isConnectedByDomainlessAndRangelessProperty(String domainUri, String rangeUri) {
		if (domainUri == null || rangeUri == null) return false;
		return (this.ontCache.getObjectPropertiesWithoutDomainAndRange().size() > 0);
	}
}
